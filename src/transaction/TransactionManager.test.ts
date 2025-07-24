import { describe, it, expect, beforeEach } from 'vitest';
import { TransactionManager } from './TransactionManager.js';
import { AssetManager } from '../asset/AssetManager.js';
import { AssetType, TransactionStatus } from '../types/index.js';

describe('TransactionManager', () => {
  let transactionManager: TransactionManager;
  let assetManager: AssetManager;
  let testAssetId: string;

  beforeEach(async () => {
    assetManager = new AssetManager();
    transactionManager = new TransactionManager(assetManager);

    // Create test asset
    const asset = await assetManager.createAsset({
      name: 'Test Asset',
      symbol: 'TEST',
      type: AssetType.EQUITY,
      totalSupply: 1000000,
    });
    testAssetId = asset.id;
  });

  describe('createTransaction', () => {
    it('should create transaction with valid parameters', async () => {
      const params = {
        assetId: testAssetId,
        amount: 1000,
        recipient: 'test-recipient',
      };

      const transaction = await transactionManager.createTransaction(params);

      expect(transaction.id).toMatch(/^tx_\d+_[a-z0-9]{9}$/);
      expect(transaction.assetId).toBe(testAssetId);
      expect(transaction.amount).toBe(1000);
      expect(transaction.recipient).toBe('test-recipient');
      expect(transaction.status).toBe(TransactionStatus.PENDING);
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt).toBeInstanceOf(Date);
    });

    it('should reject transaction with amount exceeding total supply', async () => {
      const params = {
        assetId: testAssetId,
        amount: 2000000, // Exceeds total supply of 1000000
        recipient: 'test-recipient',
      };

      await expect(transactionManager.createTransaction(params)).rejects.toThrow(
        'Transaction amount 2000000 exceeds asset total supply 1000000'
      );
    });

    it('should reject transaction with zero amount', async () => {
      const params = {
        assetId: testAssetId,
        amount: 0,
        recipient: 'test-recipient',
      };

      await expect(transactionManager.createTransaction(params)).rejects.toThrow(
        'Amount must be positive'
      );
    });

    it('should reject transaction with negative amount', async () => {
      const params = {
        assetId: testAssetId,
        amount: -100,
        recipient: 'test-recipient',
      };

      await expect(transactionManager.createTransaction(params)).rejects.toThrow();
    });

    it('should reject transaction with non-existent asset', async () => {
      const params = {
        assetId: 'non-existent-asset',
        amount: 1000,
        recipient: 'test-recipient',
      };

      await expect(transactionManager.createTransaction(params)).rejects.toThrow(
        'Asset non-existent-asset not found'
      );
    });
  });

  describe('executeTransaction', () => {
    it('should execute existing transaction successfully', async () => {
      const params = {
        assetId: testAssetId,
        amount: 1000,
        recipient: 'test-recipient',
      };

      const transaction = await transactionManager.createTransaction(params);
      const result = await transactionManager.executeTransaction(transaction.id);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe(transaction.id);
      expect(result.blockHash).toMatch(/^0x[a-f0-9]{64}$/);
      expect(result.timestamp).toBeInstanceOf(Date);

      // Check transaction status was updated
      const updatedTransaction = transactionManager.getTransaction(transaction.id);
      expect(updatedTransaction?.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should throw error for non-existent transaction', async () => {
      await expect(transactionManager.executeTransaction('non-existent')).rejects.toThrow(
        'Transaction non-existent not found'
      );
    });
  });

  describe('getTransaction', () => {
    it('should return transaction by ID', async () => {
      const params = {
        assetId: testAssetId,
        amount: 1000,
        recipient: 'test-recipient',
      };

      const createdTransaction = await transactionManager.createTransaction(params);
      const retrievedTransaction = transactionManager.getTransaction(createdTransaction.id);

      expect(retrievedTransaction).toBe(createdTransaction);
    });

    it('should return undefined for non-existent transaction', () => {
      const result = transactionManager.getTransaction('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const params1 = {
        assetId: testAssetId,
        amount: 1000,
        recipient: 'recipient-1',
      };

      const params2 = {
        assetId: testAssetId,
        amount: 2000,
        recipient: 'recipient-2',
      };

      const transaction1 = await transactionManager.createTransaction(params1);
      const transaction2 = await transactionManager.createTransaction(params2);

      const allTransactions = transactionManager.getAllTransactions();

      expect(allTransactions).toHaveLength(2);
      expect(allTransactions).toContain(transaction1);
      expect(allTransactions).toContain(transaction2);
    });

    it('should return empty array when no transactions exist', () => {
      const allTransactions = transactionManager.getAllTransactions();
      expect(allTransactions).toHaveLength(0);
    });
  });
});
