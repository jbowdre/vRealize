/*  JavaScript: delete dns record
    Deletes records in Microsoft DNS by way of an SSH bastion host upon deployment deletion.
    Inputs: inputProperties (Properties), dnsHost (CompositeType(sshHost:string,sshUser:string,sshPass:SecureString,dnsServers:Array/string,supportedDomains:Array/string):dnsHost)
    Outputs: none
*/
var hostname = inputProperties.resourceNames[0];
var dnsDomain = inputProperties.customProperties.domain;
var deleted = false;
if (dnsHost_supportedDomains.indexOf(dnsDomain) >= 0) {
    System.log("Attempting to remove DNS record for " + hostname + "...");
    var sshSession = new SSHSession(dnsHost_sshHost, dnsHost_sshUser);
    System.debug("Connecting to " + dnsHost_sshHost + "...");
    sshSession.connectWithPassword(dnsHost_sshPass);
    for each (var dnsServer in dnsHost_dnsServers) {
        if (deleted == false) {
            System.debug("Using DNS Server " + dnsServer + "...");
            var sshCommand = 'Remove-DnsServerResourceRecord -ComputerName ' + dnsServer + ' -Name ' + hostname + ' -ZoneName ' + dnsDomain + ' -RRType A -Force';
            System.debug("sshCommand: " + sshCommand);
            sshSession.executeCommand(sshCommand, true);
            if (sshSession.exitCode == 0) {
                System.log("Successfully deleted DNS record.");
                deleted = true;
            }
        }
    }
    sshSession.disconnect();
    if (deleted == false) {
        System.warn("Error! Unable to delete DNS record.");
    }
} else {
    System.log("No need to remove DNS records.");
}