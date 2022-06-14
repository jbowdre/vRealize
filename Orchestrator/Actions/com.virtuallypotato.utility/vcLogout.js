/*  JavaScript: vcLogout action
    Logs out of a connected vCenter REST endpoint.
    Inputs: token (string), vCenterName (string)
    Return type: string
*/
var host = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "Endpoints", vCenterName).host;
System.debug("Closing vCenter API session: " + token);
var request = host.createRequest("DELETE", "/api/session");
request.setHeader("Content-Type", "application/json");
request.setHeader("vmware-api-session-id", token);
var result = request.execute().statusCode;
System.debug("Result status code: " + result);
