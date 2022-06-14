/*  JavaScript: vcLogin action
    Retrieves a login token to a vCenter REST endpoint.
    Inputs: vCenterName (string)
    Return type: string
*/
var host = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "Endpoints", vCenterName).host;
var request = host.createRequest("POST", "/api/session");
request.setHeader("Content-Type", "application/json");
var response = request.execute();
var token = JSON.parse(response.contentAsString);
System.debug("Created vCenter API session: " + token);

return token;
