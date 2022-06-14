/*  JavaScript: logPayloadProperties action
    Writes out all the properties of a VM request payload from vRA for testing purposes.
    Inputs: payload (Properties)
    Return Type: string
*/
System.debug("==== Begin: vRA Event Broker Payload Properties ====");
logAllProperties(inputProperties,0);
System.debug("==== End: vRA Event Broker Payload Properties ====");

function logAllProperties(props,indent) {
    var keys = (props.keys).sort();
    for each (var key in keys) {
        var prop = props.get(key);
        var type = System.getObjectType(prop);
        if (type == "Properties") {
            logSingleProperty(key,prop,indent);
            logAllProperties(prop,indent+1);
        } else {
            logSingleProperty(key,prop,indent);
        }
    }
}

function logSingleProperty(name,value,i) {
    var prefix = "";
    if (i > 0) {
        var prefix = Array(i+1).join("-") + " ";
    }
    System.debug(prefix + name + " :: " + System.getObjectType(value) + " :: " + value);
}
