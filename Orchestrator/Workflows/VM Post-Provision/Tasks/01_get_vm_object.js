/*  JavaScript: get VM object
    Retrieves a VC:VirtualMachine object matching the resourceName from the VcPlugin
    Inputs: inputProperties (Properties)
    Outputs: vm (VC:VirtualMachine)
*/
var name = inputProperties.resourceNames[0];
var vms = VcPlugin.getAllVirtualMachines(null, name);
System.debug("Found VM object: " + vms[0]);
vm = vms[0];