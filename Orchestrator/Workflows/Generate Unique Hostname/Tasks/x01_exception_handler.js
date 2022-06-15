/*  JavaScript: exception handler
    Log the exception and release the lock.
    Inputs: none
    Outputs: none
*/
System.error("Workflow execution failed!");
System.debug("Releasing lock...");
LockingSystem.unlock("namingLock", "eventBroker");