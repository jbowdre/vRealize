/*  JavaScript: unpack payload
    Extracts needed variables from the vRA inputProperties
    Inputs: inputProperties (Properties)
    Outputs: originalNames (Array/string), domain (string), nameBase (string), endpointId (string), digits (number)
*/
nameBase = inputProperties.customProperties.nameBase;
originalNames = inputProperties.resourceNames;
domain = inputProperties.customProperties.domain;
endpointId = inputProperties.endpointId;
digits = inputProperties.customProperties.digits;