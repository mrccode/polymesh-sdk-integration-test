import { describe, it, expect, beforeEach } from 'vitest';
import { PolymeshAPI } from './PolymeshAPI.js';
import { AssetType } from '../types/index.js';

describe('PolymeshAPI', () => {
  let api: PolymeshAPI;

  beforeEach(() => {
    api = new PolymeshAPI();
  });

  describe('healthCheck', () => {
    it('should return healthy status', async () => {
      const response = await api.healthCheck();

      expect(response.success).toBe(true);
      expect(response.data?.status).toBe('healthy');
      expect(response.data?.uptime).toBeTypeOf('number');
      expect(response.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getVersion', () => {
    it('should return version information', () => {
      const response = api.getVersion();

      expect(response.success).toBe(true);
      expect(response.data?.version).toBe('0.1.0');
      expect(response.data?.apiVersion).toBe('v1');
      expect(response.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getTransactions', () => {
    it('should return paginated empty transactions initially', async () => {
      const options = {
        page: 1,
        limit: 10,
      };

      const response = await api.getTransactions(options);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(0);
      expect(response.timestamp).toBeInstanceOf(Date);
    });

    it('should return paginated transactions with sorting', async () => {
      // Create test asset and transactions
      const asset = await api.assets.createAsset({
        name: 'Test Asset',
        symbol: 'TEST',
        type: AssetType.EQUITY,
        totalSupply: 1000000,
      });

      await api.transactions.createTransaction({
        assetId: asset.id,
        amount: 1000,
        recipient: 'recipient-1',
      });

      await api.transactions.createTransaction({
        assetId: asset.id,
        amount: 2000,
        recipient: 'recipient-2',
      });

      const options = {
        page: 1,
        limit: 10,
        sortBy: 'amount',
        sortOrder: 'desc' as const,
      };

      const response = await api.getTransactions(options);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
      expect(response.data?.[0].amount).toBe(2000);
      expect(response.data?.[1].amount).toBe(1000);
    });

    it('should handle pagination correctly', async () => {
      // Create test asset and multiple transactions
      const asset = await api.assets.createAsset({
        name: 'Test Asset',
        symbol: 'TEST',
        type: AssetType.EQUITY,
        totalSupply: 1000000,
      });

      // Create 5 transactions
      for (let i = 1; i <= 5; i++) {
        await api.transactions.createTransaction({
          assetId: asset.id,
          amount: i * 100,
          recipient: `recipient-${i}`,
        });
      }

      // Get page 1 with limit 2
      const page1 = await api.getTransactions({ page: 1, limit: 2 });
      expect(page1.success).toBe(true);
      expect(page1.data).toHaveLength(2);

      // Get page 2 with limit 2
      const page2 = await api.getTransactions({ page: 2, limit: 2 });
      expect(page2.success).toBe(true);
      expect(page2.data).toHaveLength(2);

      // Get page 3 with limit 2 (should have 1 remaining)
      const page3 = await api.getTransactions({ page: 3, limit: 2 });
      expect(page3.success).toBe(true);
      expect(page3.data).toHaveLength(1);
    });
  });

  describe('manager access', () => {
    it('should provide access to transaction manager', () => {
      expect(api.transactions).toBeDefined();
      expect(typeof api.transactions.createTransaction).toBe('function');
    });

    it('should provide access to asset manager', () => {
      expect(api.assets).toBeDefined();
      expect(typeof api.assets.createAsset).toBe('function');
    });
  });
});
