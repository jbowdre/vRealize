/*  JavaScript: vcGetCustomizationSpecs
    Retrieves a list of customization specs available for a given zone and image.
    Inputs: imageName (string), zoneName (string)
    Return type: array/string
*/
if (!(imageName == "" || imageName == null))  {
    var cloudAccountId = null;
    var vraToken = System.getModule("com.virtuallypotato.utility").vraLogin();
    var zones = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(vraToken, "GET", "/iaas/api/zones", null)).content;
    System.debug("Zones: " + JSON.stringify(zones));
    for each (zone in zones) {
        System.debug("Found zone: " + zone.name);
        if (zone.name === zoneName) {
            cloudAccountId = (zone._links["cloud-account"].href).split("/").pop();
        }
        if (cloudAccountId != null) { break; };
    }
    System.debug("Cloud Account ID: " + cloudAccountId);

    var vCenterName = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(vraToken, "GET", "/iaas/api/cloud-accounts-vsphere/" + cloudAccountId, null)).hostName.split(".")[0];
    System.debug("vCenterName is: " + vCenterName);
    var imageFamily = null;
    var images = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(vraToken, "GET", "/iaas/api/images", null)).content;
    System.debug("Images: " + JSON.stringify(images));
    for each (image in images) {
        for (var i in image.mapping) {
            if (i === imageName) {
                imageFamily = image.mapping[i].osFamily;          
            }
        }
        if (imageFamily != null) { break; };
    }
    System.debug("Image family: " + imageFamily);

    var vcToken = System.getModule("com.virtuallypotato.utility").vcLogin(vCenterName);
    var specs = JSON.parse(System.getModule("com.virtuallypotato.utility").vcExecute(vcToken, "GET", "/api/vcenter/guest/customization-specs?os_type=" + imageFamily, null, vCenterName));
    System.debug("Customization specs: " + JSON.stringify(specs));
    customSpecs = new Array();
    for each (spec in specs) {
        customSpecs.push(spec.name);
    }
    System.getModule("com.virtuallypotato.utility").vcLogout(vcToken, vCenterName);

    customSpecs.sort();
    return customSpecs;
} else {
    return [""];
}
