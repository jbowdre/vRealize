/*  JavaScript: remove lock
    Removes the lock to re-allow subsequent workflow runs
    Inputs: none
    Outputs: none
*/
System.debug("Releasing lock...");
LockingSystem.unlock("namingLock","eventBroker");