// Deprecated APIs removed - BREAKING CHANGE
// The submit() method has been removed
// Use submitAndWait() instead

export class Transaction {
  // submit() method removed - BREAKING CHANGE

  async submitAndWait(): Promise<void> {
    // New implementation
    // Transaction submitted and waiting for confirmation
    return Promise.resolve();
  }
}
