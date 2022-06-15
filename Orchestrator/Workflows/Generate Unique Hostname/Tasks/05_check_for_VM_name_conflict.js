/*  JavaScript: check for VM name conflict
    Iterates through an array of VM object to check for naming collisions.
    Inputs: candidateVmName (string), vms (Array/VC:VirtualMachine)
    Outputs: conflict (boolean)
    Exception binding: errMsg (string)
*/
vms.forEach(function(vm) {
  if (vm.name.toUpperCase() === candidateVmName) {
      conflict = true;
      errMsg = "Found a conflicting VM name!";
      System.warn(errMsg);
      throw(errMsg);
  } 
});
System.log("No VM name conflicts found for " + candidateVmName);