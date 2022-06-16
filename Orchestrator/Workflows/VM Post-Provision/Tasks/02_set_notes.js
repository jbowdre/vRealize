/*  JavaScript: set notes
    Adds notes and custom attributes to the VC:VirtualMachine
    Inputs: inputProperties (Properties), vm (VC:VirtualMachine)
    Outputs: none
*/
var notes = inputProperties.customProperties.description;
var poc = inputProperties.customProperties.poc;
var ticket = inputProperties.customProperties.ticket;
var spec = new VcVirtualMachineConfigSpec();
spec.annotation = notes;
vm.reconfigVM_Task(spec);
System.log("Set VM description: " + notes);
System.getModule("com.vmware.library.vc.customattribute").setOrCreateCustomField(vm, "Point of Contact", poc);
System.getModule("com.vmware.library.vc.customattribute").setOrCreateCustomField(vm, "Ticket", ticket);
System.log("Set VM attributes: Point of Contact " + poc + ", Ticket " + ticket);