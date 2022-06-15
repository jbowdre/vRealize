/*  JavaScript: conflict encountered
    Resets the conflict flag and passes control back to the 'generate candidateVmName'
    Inputs: digits (number)
    Outputs: conflict (boolean)
    Exception binding: errMsg (string)
*/
if (digits) {
  errMsg = 'User-specified name is not available, aborting...';
  throw(errMsg);
} else {
  System.log("Conflict encountered, trying a new name...")
  conflict = false
}