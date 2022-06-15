/*  JavaScript: check for DNS conflict
    Checks for conflicting DNS records.
    Inputs: candidateVmName (string), conflict (boolean), domain (string)
    Outputs: conflict (boolean)
    Exception binding: errMsg (string)
*/
if (conflict) {
  System.debug("Existing conflict found, skipping DNS check...");
} else {
  if (System.resolveHostName(candidateVmName + "." + domain)) {
      conflict = true;
      errMsg = "Conflicting DNS record found!";
      System.warn(errMsg);
      throw(errMsg);
  } else {
      System.log("No DNS conflict for " + candidateVmName)
  }
}