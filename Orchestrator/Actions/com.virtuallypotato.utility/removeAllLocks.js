/*  JavaScript: removeAllLocks action
    Removes all vRO locks for resolving stuck workflows
    Inputs: None
    Return Type: string
*/
System.debug("Removing locks...");
LockingSystem.unlockAll();
