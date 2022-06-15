/*  JavaScript: generate candidateVmName
    Appends appropriate numbering sequence to nameBase
    Inputs: digitCount (number), nameBase (string), digits (number), hostnameSequence (number), computerNames (ConfigurationElement)
    Outputs: computerNames (ConfigurationElement), candidateVmName (string), hostnameSequence (number)
    Exception binding: errMsg (string)
*/
if (digits) {
  hostnameSequence = digits;
  System.log("Manually setting sequence to user-provided input: " + digits)
} else {
  try {
      hostnameSequence = computerNames.getAttributeWithKey(nameBase).value;
      System.debug("Found hostname base " + nameBase + " with sequence " + hostnameSequence);
  } catch (e) {
      System.debug("Hostname base " + nameBase + " does not exist, it will be created.");
  } finally {
      hostnameSequence++;
      if (hostnameSequence.toString().length > digitCount) {
          errMsg = 'All out of potential VM names, aborting...';
          throw(errMsg);
      }
      System.debug("Adding " + nameBase + " with sequence " + hostnameSequence);
      computerNames.setAttributeWithKey(nameBase,hostnameSequence);
  }
}
var hostnameNum = hostnameSequence.toString();
var leadingZeroes = new Array(digitCount - hostnameNum.length + 1).join("0");
hostnameNum = leadingZeroes + hostnameNum;
candidateVmName = (nameBase + hostnameNum).toUpperCase();
System.log("Proposed VM name: " + candidateVmName);