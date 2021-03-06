/*  JavaScript: getConfigValue action
    Retrieves the configuration element attribute value for a given key.
    Inputs: path (string), configurationName (string), variableName (string)
    Return type: string
*/

var configElement = null;
for each (configElement in Server.getConfigurationElementCategoryWithPath(path).configurationElements) {
    if (configElement.name.indexOf(configurationName) === 0) { break; };
}
var attribValue = configElement.getAttributeWithKey(variableName).value;

return attribValue;
