/*  JavaScript: vraGetImages action
    Retrieves the list of flavors (sizes) available in a given Zone.
    Inputs: zoneName (string)
    Return type: array/string
*/
if (!(zoneName == "" || zoneName == null)) {
    var arrFlavors = new Array();
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

    var flavors = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/flavors", null)).content;
    System.debug("Flavors: " + JSON.stringify(flavors));
    flavors.forEach(
        function (flavor) {
            if (flavor._links.region.href === regionUri) {
                System.debug("Flavors in region: " + JSON.stringify(flavor.mapping));
                for (var i in flavor.mapping) {
                    System.debug("Flavor: " + i);
                    arrFlavors.push(i);
                }
            }
        }
    );

    arrFlavors.sort();
    System.getModule("com.virtuallypotato.utility").vraLogout(token);
    return arrFlavors;
} else {
    return [""];
}
