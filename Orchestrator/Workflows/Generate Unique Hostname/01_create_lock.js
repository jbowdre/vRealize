/*  JavaScript: create lock
    Creates a vRO lock to avoid conflicts from multiple concurrent workflow runs.
    Inputs: none
    Outputs: none
*/
System.debug("Creating lock...");
LockingSystem.lockAndWait("namingLock","eventBroker");