/*  JavaScript: vraGetImages action
    Retrieves the list of images available in a given Zone.
    Inputs: zoneName (string)
    Return type: array/string
*/
if (!(zoneName == "" || zoneName == null)) {
    var arrImages = new Array();
    var regionUri = null;
    var token = System.getModule("com.virtuallypotato.utility").vraLogin();
    var zones = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/zones", null)).content;
    System.debug("Zones: " + JSON.stringify(zones));
    for each (zone in zones) {
        if (zone.name === zoneName) {
            System.debug("Matching zone: " + zone.name);
            regionUri = zone._links.region.href;
        }
        if (regionUri != null) { break; };
    }
    System.debug("Matching region URI: " + regionUri);
    var images = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/images", null)).content;
    System.debug("Images: " + JSON.stringify(images));
    images.forEach(
        function (image) {
            if (image._links.region.href === regionUri) {
                System.debug("Images in region: " + JSON.stringify(image.mapping));
                for (var i in image.mapping) {
                    System.debug("Image: " + i);
                    arrImages.push(i);
                }
            }
        }
    );
    arrImages.sort();
    System.getModule("com.virtuallypotato.utility").vraLogout(token);
    return arrImages;
} else {
    return [""];
}
