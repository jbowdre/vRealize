/*  JavaScript: get vCenterName
    Queries vRA to match the vCenter endpointId to a fully-qualified name, which gets returned to vRA as a customProperty on the deployment and also passed to subsequent workflow tasks
    Inputs: endpointId (string)
    Outputs: customProperties (Properties), vCenterName (string)
*/
var cloudAccountId = null;
var token = System.getModule("com.virtuallypotato.utility").vraLogin();
vCenterName = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/cloud-accounts-vsphere/" + endpointId, null)).hostName;
System.getModule("com.virtuallypotato.utility").vraLogout(token);
System.debug("Found vCenter: " + vCenterName);
customProperties = new Properties();
customProperties.put("vCenter", vCenterName);