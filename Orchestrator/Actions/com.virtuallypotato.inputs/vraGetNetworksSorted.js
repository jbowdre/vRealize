/*  JavaScript: vraGetNetworksSorted action
    Retrieves a (sorted) list of network names and corresponding constraint tags available for deployment in a given zone.
    Inputs: zoneName (string)
    Return type: Properties
*/
if (!(zoneName == "" || zoneName == null)) {
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

    var networkProfiles = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/network-profiles", null)).content;
    System.debug("Network profiles: " + JSON.stringify(networkProfiles));
    networks = new Array();
    networkProfiles.forEach(
        function (networkProfile) {
            if (networkProfile._links.region.href === regionUri) {
                for each (uri in networkProfile._links["fabric-networks"].hrefs) {
                    var networkProps = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", uri, null));
                    System.debug(JSON.stringify(networkProps));
                    var networkTag = null;
                    for each (tag in networkProps.tags) {
                        if (tag.key === "network") {
                            networkTag = "network:" + tag.value;
                        }
                        if (networkTag != null) { break; };
                    }
                    networks.push(new Properties({value: networkTag, label: networkProps.name}));
                }
            }
        }
    );

    networks.sort(
        function (a, b) {
            return a.label > b.label ? 1 : (a.label < b.label ? -1 : 0);
        }
    );

    System.getModule("com.virtuallypotato.utility").vraLogout(token);
    return networks;
} else {
    return [""];
}
