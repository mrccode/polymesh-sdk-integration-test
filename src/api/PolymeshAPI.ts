import { APIResponse, PaginationOptions } from '../types/index.js';
import { TransactionManager } from '../transaction/TransactionManager.js';
import { AssetManager } from '../asset/AssetManager.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

export class PolymeshAPI {
  private transactionManager: TransactionManager;
  private assetManager: AssetManager;
  private errorHandler: ErrorHandler;

  constructor() {
    this.assetManager = new AssetManager();
    this.transactionManager = new TransactionManager(this.assetManager);
    this.errorHandler = new ErrorHandler();
  }

  /**
   * Creates a standardized API response
   * Response format may change in breaking change tests
   */
  private createResponse<T>(data?: T, error?: string): APIResponse<T> {
    const response: APIResponse<T> = {
      success: !error,
      timestamp: new Date(),
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (error !== undefined) {
      response.error = error;
    }

    return response;
  }

  /**
   * Gets paginated transactions
   * Pagination interface may change in breaking change tests
   */
  async getTransactions(options: PaginationOptions): Promise<APIResponse<any[]>> {
    try {
      const allTransactions = this.transactionManager.getAllTransactions();
      const startIndex = (options.page - 1) * options.limit;
      const endIndex = startIndex + options.limit;

      const sortedTransactions = [...allTransactions];

      if (options.sortBy) {
        sortedTransactions.sort((a, b) => {
          const aValue = (a as any)[options.sortBy!];
          const bValue = (b as any)[options.sortBy!];

          if (options.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

      return this.createResponse(paginatedTransactions);
    } catch (error) {
      const handledError = this.errorHandler.handle(error);
      return this.createResponse([] as any[], handledError.message);
    }
  }

  /**
   * Health check endpoint
   * This endpoint may be restructured in breaking change tests
   */
  async healthCheck(): Promise<APIResponse<{ status: string; uptime: number }>> {
    return this.createResponse({
      status: 'healthy',
      uptime: process.uptime(),
    });
  }

  /**
   * Gets API version information
   * Version format may change in breaking change tests
   */
  getVersion(): APIResponse<{ version: string; apiVersion: string }> {
    return this.createResponse({
      version: '0.1.0',
      apiVersion: 'v1',
    });
  }

  /**
   * Gets reference to transaction manager for direct access
   * This access pattern may be deprecated in breaking change tests
   */
  get transactions(): TransactionManager {
    return this.transactionManager;
  }

  /**
   * Gets reference to asset manager for direct access
   * This access pattern may be deprecated in breaking change tests
   */
  get assets(): AssetManager {
    return this.assetManager;
  }
}
