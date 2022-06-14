/*  JavaScript: vraLogout action
    Logs out of a connected vRA REST endpoint.
    Inputs: token (string)
    Return type: string
*/
var host = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "Endpoints", "vRAHost").host;
var logoutObj = {
    idToken: token
};
var logoutJson = JSON.stringify(logoutObj);
var request = host.createRequest("POST", "/csp/gateway/am/api/auth/logout", logoutJson);
request.setHeader("Content-Type", "application/json");
request.execute().statusCode;
System.debug("Terminated vRA API session: " + token);
