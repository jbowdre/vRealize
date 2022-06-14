/*  JavaScript: vraExecute action
    Executes an action against a vRA REST endpoint.
    Inputs: token (string), method (string), uri (string), content (string)
    Return type: string
*/
var host = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "Endpoints", "vRAHost").host;
System.log(host);
if (content) {
    var request = host.createRequest(method, uri, content);
} else {
    var request = host.createRequest(method, uri);
}
request.setHeader("Content-Type", "application/json");
request.setHeader("Authorization", "Bearer " + token);
var response = request.execute();
var statusCode = response.statusCode;
var responseContent = response.contentAsString;
if (statusCode > 399) {
    System.error(responseContent);
    throw "vraExecute action failed, status code: " + statusCode;
}

return responseContent;
