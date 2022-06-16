/*  JavaScript: enableVBS
    Modifies a VM to enable Virtualization Based Security.
    Inputs: vmName (string)
    Return type: string
*/
var vm = VcPlugin.getAllVirtualMachines(null, vmName)[0];

// Power off VM if it's running
var originalState = vm.state;
if (originalState === "poweredOn") {
    System.log("VM is running running. Stopping VM...")
    // Create sleep() function
    function sleep(milliseconds) {
      var timeStart = new Date().getTime();
      while (true) {
         var elapsedTime = new Date().getTime() - timeStart;
         if (elapsedTime > milliseconds) {
            break;
         }
      }
   }
    vm.shutdownGuest();
    while (vm.state != "poweredOff") {
        System.debug("VM is stopping...")
        sleep(4000);
        vm = VcPlugin.getAllVirtualMachines(null, vmName)[0];
    }
    System.log("VM is stopped.");
}

// Enable VBS
var bootOpts = new VcVirtualMachineBootOptions();
var flags = new VcVirtualMachineFlagInfo();
var spec = new VcVirtualMachineConfigSpec();
bootOpts.efiSecureBootEnabled = true;
flags.vbsEnabled = true;
flags.vvtdEnabled = true;
spec.firmware = VcGuestOsDescriptorFirmwareType.efi;
spec.nestedHVEnabled = true;
spec.bootOptions = bootOpts;
spec.flags = flags;
System.log("Reconfiguring VM...")
vm.reconfigVM_Task(spec);

// Start VM if it was running.
if (originalState === "poweredOn") {
    System.log("VM is starting...")
    vm.powerOnVM_Task();
}
