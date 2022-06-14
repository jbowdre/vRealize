/*  JavaScript: vraGetZones action
    Returns the names of available Cloud Zones.
    Inputs: none
    Return type: Array/string
*/
var zoneNames = new Array();
var token = System.getModule("com.virtuallypotato.utility").vraLogin();
var zones = JSON.parse(System.getModule("com.virtuallypotato.utility").vraExecute(token, "GET", "/iaas/api/zones", null)).content;
zones.forEach(
    function (zone) {
        zoneNames.push(zone.name);
    }
);
zoneNames.sort();
System.getModule("com.virtuallypotato.utility").vraLogout(token);

return zoneNames;
