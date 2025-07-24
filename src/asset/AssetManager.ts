import { Asset, AssetMetadata } from '../types/index.js';

export class AssetManager {
  private assets: Map<string, Asset> = new Map();

  /**
   * Creates a new asset
   * Parameter structure may change in breaking change tests
   */
  async createAsset(metadata: AssetMetadata): Promise<Asset> {
    const asset: Asset = {
      id: this.generateAssetId(),
      name: metadata.name,
      symbol: metadata.symbol,
      type: metadata.type,
      totalSupply: metadata.totalSupply,
      decimals: metadata.decimals || 6,
      createdAt: new Date(),
      metadata: {
        ...(metadata.description && { description: metadata.description }),
        ...(metadata.website && { website: metadata.website }),
        ...(metadata.logo && { logo: metadata.logo }),
      },
    };

    this.assets.set(asset.id, asset);
    return asset;
  }

  /**
   * Gets asset by symbol
   * This method may be deprecated in breaking change tests
   */
  getAssetBySymbol(symbol: string): Asset | undefined {
    return Array.from(this.assets.values()).find(asset => asset.symbol === symbol);
  }

  /**
   * Gets asset by ID
   * Return type may become nullable in breaking change tests
   */
  getAsset(id: string): Asset {
    const asset = this.assets.get(id);
    if (!asset) {
      throw new Error(`Asset ${id} not found`);
    }
    return asset;
  }

  /**
   * Updates asset metadata
   * This method interface may change in breaking change tests
   */
  updateAssetMetadata(id: string, updates: Partial<AssetMetadata>): Asset {
    const asset = this.getAsset(id);

    if (updates.name) {
      asset.name = updates.name;
    }
    if (updates.symbol) {
      asset.symbol = updates.symbol;
    }
    if (updates.description !== undefined) {
      asset.metadata.description = updates.description;
    }
    if (updates.website !== undefined) {
      asset.metadata.website = updates.website;
    }
    if (updates.logo !== undefined) {
      asset.metadata.logo = updates.logo;
    }

    return asset;
  }

  private generateAssetId(): string {
    return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }
}
