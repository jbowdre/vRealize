/*  JavaScript: check for AD conflict 
    Checks for conflicting names in Active Directory
    Inputs: candidateVmName (string), conflict (boolean), adHost (AD:AdHost)
    Outputs: conflict (boolean)
    Exception binding: errMsg (string)
*/
if (conflict) {
  System.debug("Existing conflict found, skipping AD check...");
} else {
  var computer = ActiveDirectory.getComputerAD(candidateVmName, adHost);
  System.debug("Searched AD for: " + candidateVmName);
  if (computer) {
      conflict = true;
      errMsg = "Conflicting AD object found!"
      System.warn(errMsg);
      throw(errMsg);
  } else {
      System.log("No AD conflict found for " + candidateVmName);
  }
}