import { describe, it, expect } from 'vitest';
import { CreateTransactionParams, TransactionStatus, AssetType } from './index.js';

describe('Types', () => {
  describe('CreateTransactionParams', () => {
    it('should validate correct transaction parameters', () => {
      const validParams = {
        assetId: 'asset_123',
        amount: 100,
        recipient: 'recipient_456',
      };

      expect(() => CreateTransactionParams.parse(validParams)).not.toThrow();
    });

    it('should reject invalid transaction parameters', () => {
      const invalidParams = {
        assetId: '',
        amount: -10,
        recipient: '',
      };

      expect(() => CreateTransactionParams.parse(invalidParams)).toThrow();
    });

    it('should reject zero amount', () => {
      const invalidParams = {
        assetId: 'asset_123',
        amount: 0,
        recipient: 'recipient_456',
      };

      expect(() => CreateTransactionParams.parse(invalidParams)).toThrow();
    });
  });

  describe('TransactionStatus', () => {
    it('should have correct enum values', () => {
      expect(TransactionStatus.PENDING).toBe('pending');
      expect(TransactionStatus.COMPLETED).toBe('completed');
      expect(TransactionStatus.FAILED).toBe('failed');
      expect(TransactionStatus.CANCELLED).toBe('cancelled');
    });
  });

  describe('AssetType', () => {
    it('should have correct enum values', () => {
      expect(AssetType.EQUITY).toBe('equity');
      expect(AssetType.DEBT).toBe('debt');
      expect(AssetType.FUND).toBe('fund');
      expect(AssetType.COMMODITY).toBe('commodity');
    });
  });
});
