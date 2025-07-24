import {
  Transaction,
  TransactionStatus,
  TransactionResult,
  CreateTransactionParams,
} from '../types/index.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { AssetManager } from '../asset/AssetManager.js';

export class TransactionManager {
  private transactions: Map<string, Transaction> = new Map();
  private errorHandler: ErrorHandler;
  private assetManager: AssetManager;

  constructor(assetManager: AssetManager) {
    this.errorHandler = new ErrorHandler();
    this.assetManager = assetManager;
  }

  /**
   * Creates a new transaction
   * This method will be modified in breaking change tests
   */
  async createTransaction(params: CreateTransactionParams): Promise<Transaction> {
    try {
      // Validate the transaction parameters using zod
      const validatedParams = CreateTransactionParams.parse(params);

      // Validate that the asset exists and has sufficient supply
      const asset = this.assetManager.getAsset(validatedParams.assetId);

      if (validatedParams.amount > asset.totalSupply) {
        throw this.errorHandler.createError(
          'INSUFFICIENT_ASSET_SUPPLY',
          `Transaction amount ${validatedParams.amount} exceeds asset total supply ${asset.totalSupply}`
        );
      }

      if (validatedParams.amount <= 0) {
        throw this.errorHandler.createError(
          'INVALID_AMOUNT',
          'Transaction amount must be greater than zero'
        );
      }

      const transaction: Transaction = {
        id: this.generateId(),
        assetId: validatedParams.assetId,
        amount: validatedParams.amount,
        recipient: validatedParams.recipient,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.transactions.set(transaction.id, transaction);
      return transaction;
    } catch (error) {
      throw this.errorHandler.handle(error);
    }
  }

  /**
   * Executes a transaction
   * This method signature may change in breaking change tests
   */
  async executeTransaction(transactionId: string): Promise<TransactionResult> {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw this.errorHandler.createError(
        'TRANSACTION_NOT_FOUND',
        `Transaction ${transactionId} not found`
      );
    }

    // Simulate async operation
    await this.delay(100);

    transaction.status = TransactionStatus.COMPLETED;
    transaction.updatedAt = new Date();

    return {
      success: true,
      transactionId: transaction.id,
      blockHash: this.generateBlockHash(),
      timestamp: new Date(),
    };
  }

  /**
   * Gets transaction by ID
   * Return type may change in breaking change tests
   */
  getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  /**
   * Lists all transactions
   * This method may be removed in breaking change tests
   */
  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  private generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBlockHash(): string {
    return `0x${Math.random().toString(16).substr(2, 16).padEnd(64, '0')}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
