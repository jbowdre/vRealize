/*  JavaScript: apply hostnames
    Iterates through the resourceNames array and replaces the original name with the new one.
    Inputs: newNames (Array/string), inputProperties (Properties)
    Outputs: resourceNames (Array/string)
*/
resourceNames = inputProperties.get("resourceNames");
for (var i=0; i<newNames.length; i++) {
    System.log("Replacing resourceName [" + resourceNames[i] + "] with [" + newNames[i] + "]");
    resourceNames[i] = newNames[i];
}