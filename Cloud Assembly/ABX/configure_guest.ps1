<# vRA 8.x ABX action to perform certain in-guest actions post-deploy:
    Windows:
        - auto-update VM tools
        - add specified domain users/groups to local Administrators group
        - extend C: volume to fill disk
        - set up remote access
        - create a scheduled task to (attempt to) apply Windows updates
    Windows:
        - TBD
    
    ## Action Inputs:
    ## Secrets:
        templatePassWinDomain                   # password for domain account with admin rights to the template (domain-joined deployments)
        templatePassWinWorkgroup                # password for local account with admin rights to the template (standalone deployments)
        templatePassLinDomain                   # password for domain account with admin rights to the template (domain-joined deployments)
        templatePassLinWorkgroup                # password for local account with admin rights to the template (standalone deployments)
        vCenterPassword                         # password for vCenter account passed from the cloud template
        
    ## Inputs from deployment:
        resourceNames[0]                        # VM name [BOW-DVRT-XXX003]
        customProperties.vCenterUser            # user for connecting to vCenter [lab\vra]
        customProperties.vCenter                # vCenter instance to connect to [vcsa.lab.bowdre.net]
        customProperties.domain                 # long-form domain name [lab.bowdre.net]
        customProperties.adminsList             # array of domain users/groups to be added as local admins [john, lab\vra, vRA-Admins]
        customProperties.adObject               # boolean to determine if the system will be joined to AD (true) or not (false)
        customProperties.templateUser           # object containing usernames corresponding to the template passwords
#>

function handler($context, $inputs) {
    # Initialize global variables
    $vcUser = $inputs.customProperties.vCenterUser
    $vcPassword = $context.getSecret($inputs."vCenterPassword")
    $vCenter = $inputs.customProperties.vCenter
    $templateUsers = $inputs.customProperties.templateUser | ConvertFrom-Json
    
    # Create vmtools connection to the VM 
    $vmName = $inputs.resourceNames[0]
    Connect-ViServer -Server $vCenter -User $vcUser -Password $vcPassword -Force
    $vm = Get-VM -Name $vmName
    Write-Host "Waiting for VM Tools to start..."
    if (-not (Wait-Tools -VM $vm -TimeoutSeconds 180)) {
        Write-Error "Unable to establish connection with VM tools" -ErrorAction Stop
    }
    
    # Detect OS type
    $count = 0
    While (!$osType) {
        Try {
            $osType = ($vm | Get-View).Guest.GuestFamily.ToString()
            $toolsStatus = ($vm | Get-View).Guest.ToolsStatus.ToString()        
        } Catch {
            # 60s timeout
            if ($count -ge 12) {
                Write-Error "Timeout exceeded while waiting for tools." -ErrorAction Stop
                break
            }
            Write-Host "Waiting for tools..."
            $count++
            Sleep 5
        }
    }
    Write-Host "$vmName is a $osType and its tools status is $toolsStatus."
    
    # Update tools on Windows if out of date
    if ($osType.Equals("windowsGuest") -And $toolsStatus.Equals("toolsOld")) {
        Write-Host "Updating VM Tools..."
        Update-Tools $vm
        Write-Host "Waiting for VM Tools to start..."
        if (-not (Wait-Tools -VM $vm -TimeoutSeconds 180)) {
            Write-Error "Unable to establish connection with VM tools" -ErrorAction Stop
        }
    }
    
    # Run OS-specific tasks
    if ($osType.Equals("windowsGuest")) {
        # Initialize Windows variables
        $domainLong = $inputs.customProperties.domain
        $adminsList = $inputs.customProperties.adminsList | ConvertFrom-Json
        $adObject = $inputs.customProperties.adObject
        $templateUser = $adObject.Equals("true") ? $templateUsers.winDomain : $templateUsers.winWorkgroup
        $templatePassword = $adObject.Equals("true") ? $context.getSecret($inputs."templatePassWinDomain") : $context.getSecret($inputs."templatePassWinWorkgroup")
      
        # Add domain accounts to local administrators group
        if ($adminsList.Length -gt 0 -And $adObject.Equals("true")) {
            # Standardize users entered without domain as DOMAIN\username
            $domainShort = $domainLong.split('.')[0]
            # $adminsArray = @(($adminsList -Split ',').Trim())
            For ($i=0; $i -lt $adminsList.Length; $i++) {
                If ($adminsList[$i] -notmatch "$domainShort.*\\" -And $adminsList[$i] -notmatch "@$domainShort") {
                    $adminsList[$i] = $domainShort + "\" + $adminsList[$i]
                }
            $admins = '"{0}"' -f ($adminsList -join '","')
            Write-Host "Administrators: $admins"
            }
            $adminScript = "Add-LocalGroupMember -Group Administrators -Member $admins"
            Start-Sleep -s 10
            Write-Host "Attempting to add administrator accounts..."
            $runAdminScript = Invoke-VMScript -VM $vm -ScriptText $adminScript -GuestUser $templateUser -GuestPassword $templatePassword
            if ($runAdminScript.ScriptOutput.Length -eq 0) {
                Write-Host "Successfully added [$admins] to Administrators group."
            } else {
                Write-Host "Attempt to add [$admins] to Administrators group completed with warnings:`n" $runAdminScript.ScriptOutput "`n"
            }
        } else {
            Write-Host "No admins to add..."
        }
        # Extend C: volume to fill system drive
        $partitionScript = "`$Partition = Get-Volume -DriveLetter C | Get-Partition; `$Partition | Resize-Partition -Size (`$Partition | Get-PartitionSupportedSize).sizeMax"
        Start-Sleep -s 10
        Write-Host "Attempting to extend system volume..."
        $runPartitionScript = Invoke-VMScript -VM $vm -ScriptText $partitionScript -GuestUser $templateUser -GuestPassword $templatePassword
        if ($runPartitionScript.ScriptOutput.Length -eq 0) {
            Write-Host "Successfully extended system partition."
        } else {
            Write-Host "Attempt to extend system volume completed with warnings:`n" $runPartitionScript.ScriptOutput "`n"
        }
        # Set up remote access
        $remoteScript = "Enable-NetFirewallRule -DisplayGroup `"Remote Desktop`"
            Enable-NetFirewallRule -DisplayGroup `"Windows Management Instrumentation (WMI)`"
            Enable-NetFirewallRule -DisplayGroup `"File and Printer Sharing`"
            Enable-PsRemoting
            Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -name `"fDenyTSConnections`" -Value 0"
        Start-Sleep -s 10
        Write-Host "Attempting to enable remote access (RDP, WMI, File and Printer Sharing, PSRemoting)..."
        $runRemoteScript = Invoke-VMScript -VM $vm -ScriptText $remoteScript -GuestUser $templateUser -GuestPassword $templatePassword
        if ($runRemoteScript.ScriptOutput.Length -eq 0) {
            Write-Host "Successfully enabled remote access."
        } else {
            Write-Host "Attempt to enable remote access completed with warnings:`n" $runRemoteScript.ScriptOutput "`n"
        }
        # Create scheduled task to apply updates
        $updateScript = "`$action = New-ScheduledTaskAction -Execute 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -Argument '-NoProfile -WindowStyle Hidden -Command `"& {Install-WUUpdates -Updates (Start-WUScan)}`"'
            `$trigger = New-ScheduledTaskTrigger -Once -At ([DateTime]::Now.AddMinutes(1))
            `$settings = New-ScheduledTaskSettingsSet -Compatibility Win8 -Hidden
            Register-ScheduledTask -Action `$action -Trigger `$trigger -Settings `$settings -TaskName `"Initial_Updates`" -User `"NT AUTHORITY\SYSTEM`" -RunLevel Highest
            `$task = Get-ScheduledTask -TaskName `"Initial_Updates`"
            `$task.Triggers[0].StartBoundary = [DateTime]::Now.AddMinutes(1).ToString(`"yyyy-MM-dd'T'HH:mm:ss`")
            `$task.Triggers[0].EndBoundary = [DateTime]::Now.AddHours(3).ToString(`"yyyy-MM-dd'T'HH:mm:ss`")
            `$task.Settings.AllowHardTerminate = `$True
            `$task.Settings.DeleteExpiredTaskAfter = 'PT0S'
            `$task.Settings.ExecutionTimeLimit = 'PT2H'
            `$task.Settings.Volatile = `$False
            `$task | Set-ScheduledTask"
        Start-Sleep -s 10
        Write-Host "Creating a scheduled task to apply updates..."
        $runUpdateScript = Invoke-VMScript -VM $vm -ScriptText $updateScript -GuestUser $templateUser -GuestPassword $templatePassword
        Write-Host "Created task:`n" $runUpdateScript.ScriptOutput "`n"            
    } elseif ($osType.Equals("linuxGuest")) {
        #TODO
        Write-Host "Linux systems not supported by this action... yet"
    }
    # Cleanup connection
    Disconnect-ViServer -Server $vCenter -Force -Confirm:$false

}
