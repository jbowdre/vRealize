/*  JavaScript: vcExecute action
    Executes an action against a vCenter REST endpoint.
    Inputs: token (string), method (string), uri (string), content (string), vCenterName (string)
    Return Type: string
*/
var host = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "Endpoints", vCenterName).host;
if (content) {
    var request = host.createRequest(method, uri, content);
} else {
    var request = host.createRequest(method, uri);
}
request.setHeader("Content-Type", "application/json");
request.setHeader("vmware-api-session-id", token);
var response = request.execute();
var statusCode = response.statusCode;
var responseContent = response.contentAsString;
if (statusCode > 399) {
    System.error(responseContent);
    throw "vcExecute action failed, status code: " + statusCode;
}

return responseContent;
