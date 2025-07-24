import { describe, it, expect, beforeEach } from 'vitest';
import { AssetManager } from './AssetManager.js';
import { AssetType } from '../types/index.js';

describe('AssetManager', () => {
  let assetManager: AssetManager;

  beforeEach(() => {
    assetManager = new AssetManager();
  });

  describe('createAsset', () => {
    it('should create asset with correct properties', async () => {
      const metadata = {
        name: 'Test Asset',
        symbol: 'TEST',
        type: AssetType.EQUITY,
        totalSupply: 1000000,
        decimals: 6,
        description: 'A test asset',
      };

      const asset = await assetManager.createAsset(metadata);

      expect(asset.id).toMatch(/^asset_\d+_[a-z0-9]{8}$/);
      expect(asset.name).toBe('Test Asset');
      expect(asset.symbol).toBe('TEST');
      expect(asset.type).toBe(AssetType.EQUITY);
      expect(asset.totalSupply).toBe(1000000);
      expect(asset.decimals).toBe(6);
      expect(asset.createdAt).toBeInstanceOf(Date);
      expect(asset.metadata.description).toBe('A test asset');
    });

    it('should use default decimals when not provided', async () => {
      const metadata = {
        name: 'Test Asset',
        symbol: 'TEST',
        type: AssetType.DEBT,
        totalSupply: 500000,
      };

      const asset = await assetManager.createAsset(metadata);
      expect(asset.decimals).toBe(6);
    });
  });

  describe('getAsset', () => {
    it('should return asset by ID', async () => {
      const metadata = {
        name: 'Test Asset',
        symbol: 'TEST',
        type: AssetType.FUND,
        totalSupply: 1000000,
      };

      const createdAsset = await assetManager.createAsset(metadata);
      const retrievedAsset = assetManager.getAsset(createdAsset.id);

      expect(retrievedAsset).toBe(createdAsset);
    });

    it('should throw error for non-existent asset', () => {
      expect(() => assetManager.getAsset('non-existent')).toThrow('Asset non-existent not found');
    });
  });

  describe('getAssetBySymbol', () => {
    it('should return asset by symbol', async () => {
      const metadata = {
        name: 'Test Asset',
        symbol: 'UNIQUE',
        type: AssetType.COMMODITY,
        totalSupply: 750000,
      };

      const createdAsset = await assetManager.createAsset(metadata);
      const retrievedAsset = assetManager.getAssetBySymbol('UNIQUE');

      expect(retrievedAsset).toBe(createdAsset);
    });

    it('should return undefined for non-existent symbol', () => {
      const result = assetManager.getAssetBySymbol('NON_EXISTENT');
      expect(result).toBeUndefined();
    });
  });

  describe('updateAssetMetadata', () => {
    it('should update asset metadata fields', async () => {
      const metadata = {
        name: 'Original Asset',
        symbol: 'ORIG',
        type: AssetType.EQUITY,
        totalSupply: 1000000,
      };

      const asset = await assetManager.createAsset(metadata);

      const updates = {
        name: 'Updated Asset',
        description: 'Updated description',
        website: 'https://example.com',
      };

      const updatedAsset = assetManager.updateAssetMetadata(asset.id, updates);

      expect(updatedAsset.name).toBe('Updated Asset');
      expect(updatedAsset.metadata.description).toBe('Updated description');
      expect(updatedAsset.metadata.website).toBe('https://example.com');
      expect(updatedAsset.symbol).toBe('ORIG'); // Should remain unchanged
    });

    it('should throw error when updating non-existent asset', () => {
      expect(() => assetManager.updateAssetMetadata('non-existent', { name: 'New Name' })).toThrow(
        'Asset non-existent not found'
      );
    });
  });
});
