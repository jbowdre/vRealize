/*  JavaScript: getSdkConnectionForVC
    Returns the VC:sdkConnection object for a given vCenter name (FQDN)
    Inputs: vCenterName (string)
    Return Type: VC:SdkConnection
*/
var vcSdkConnection = null;
var sdkConnections = VcPlugin.allSdkConnections;
for each (sdkConnection in sdkConnections) {
    if (sdkConnection.sdkId === vCenterName) {
        System.debug("Found matching vCenter SDK endpoint: " + sdkConnection.name);
        vcSdkConnection = sdkConnection;
    }
    if (vcSdkConnection != null) { break; };
}
return vcSdkConnection;
