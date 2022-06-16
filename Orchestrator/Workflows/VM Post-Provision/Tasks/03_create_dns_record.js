/*  JavaScript: create dns record
    Optionally creates a static record in Microsoft DNS by way of an SSH bastion host.
    Inputs: inputProperties (Properties), dnsHost (CompositeType(sshHost:string,sshUser:string,sshPass:SecureString,dnsServers:Array/string,supportedDomains:Array/string):dnsHost)
    Outputs: none
*/
var staticDns = inputProperties.customProperties.staticDns;
var hostname = inputProperties.resourceNames[0];
var dnsDomain = inputProperties.customProperties.domain;
var ipAddress = inputProperties.addresses[0];
var created = false;
if (staticDns == "true" && dnsHost.supportedDomains.indexOf(dnsDomain) >= 0) {
    System.log("Attempting to create DNS record for " + hostname + "." + ipAddress + "...");
    var sshSession = new SSHSession(dnsHost.sshHost, dnsHost_sshUser);
    System.debug("Connecting to " + dnsHost.sshHost + "...");
    sshSession.connectWithPassword(dnsHost.sshPass);
    for each (dnsServer in dnsHost.dnsServers) {
        if (created == false) {
            System.debug("Using DNS Server " + dnsServer + "...");
            var sshCommand = 'Add-DnsServerResourceRecordA -ComputerName ' + dnsServer + ' -Name ' + hostname + ' -ZoneName ' + dnsDomain + ' -AllowUpdateAny -IPv4Address ' + ipAddress;
            System.debug("sshCommand: " + sshCommand);
            sshSession.executeCommand(sshCommand, true);
            if (sshSession.exitCode == 0) {
                System.log("Successfully created DNS record.");
                created = true;
            }
        }
    }
    sshSession.disconnect();
    if (created == false) {
        System.warn("Error! Unable to create DNS record.");
    }
} else {
    System.log("Not trying to do DNS.");
}