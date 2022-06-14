/*  JavaScript: vraGetVcenter action
    Returns the vCenter hostname associated with a given site.
    Inputs: zoneName (string)
    Return type: string
*/
var cloudAccountId = null;
var token = System.getModule("com.virtuallypotato.utility").vraLogin();
var zones = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/zones", null)).content;
System.debug("Zones: " + JSON.stringify(zones));
for each (zone in zones) {
    if (zone.name === zoneName) {
        cloudAccountId = (zone._links["cloud-account"].href).split('/').pop();
    }
    if (cloudAccountId != null) { break; };
}
System.debug("Cloud Account ID: " + cloudAccountId);
var vCenterName = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/cloud-accounts-vsphere/" + cloudAccountId, null)).hostName.split('.')[0];
System.getModule("com.virtuallypotato.utility").vraLogout(token);

return vCenterName;
