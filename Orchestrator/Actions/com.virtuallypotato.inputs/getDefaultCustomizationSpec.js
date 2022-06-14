/*  JavaScript: getDefaultCustomizationSpec action
    Consults a vRO configuration ("CustomizationSpecs") to suggest a default/preferred customization spec based on OS family type and whether the machine will be domain-joined.
    Inputs: imageName (string), adObject (boolean)
*/
if (!(imageName == "" || imageName == null)) {
    var imageFamily = null;
    var join = null;
    var vraToken = System.getModule("com.virtuallypotato.utility").vraLogin();
    var images = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(vraToken, "GET", "/iaas/api/images", null)).content;
    System.debug("Images: " + JSON.stringify(images));
    System.getModule("com.virtuallypotato.utility").vraLogout(vraToken);
    for each (image in images) {
        for (var i in image.mapping) {
            if (i === imageName) {
                imageFamily = image.mapping[i].osFamily;          
            }
        }
        if (imageFamily != null) { break; };
    }
    if (adObject) {
        join = "domain";
    } else {
        join = "workgroup";
    }
    var desiredSpec = imageFamily + "-" + join;
    System.debug("Desired spec: " + desiredSpec);
    try {
        var customSpec = System.getModule("com.virtuallypotato.utility").getConfigValue("vPotato", "CustomizationSpecs", desiredSpec);
        System.debug("Found spec: " + customSpec);
    } catch (exception) {
        return "";
    }
    return customSpec;
} else {
    return "";
}
