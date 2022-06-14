/*  JavaScript: vraLogin action
    Retrieves a login token to a vRA REST endpoint.
    Inputs: none
    Return type: string
*/
var restHost = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "Endpoints", "vRAHost");
var host = restHost.host;
var loginObj = {
    domain: restHost.domain,
    password: restHost.password,
    username: restHost.username
};
var loginJson = JSON.stringify(loginObj);
var request = host.createRequest("POST", "/csp/gateway/am/api/login", loginJson);
request.setHeader("Content-Type", "application/json");
var response = request.execute();
var token = JSON.parse(response.contentAsString).cspAuthToken;
System.debug("Created vRA API session: " + token);

return token;
