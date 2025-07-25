import { z } from 'zod';

// Transaction types - may be modified in breaking change tests
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Zod schema for transaction creation parameters
export const CreateTransactionParams = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  amount: z.number().positive('Amount must be positive'),
  recipient: z.string().min(1, 'Recipient is required'),
});

export type CreateTransactionParams = z.infer<typeof CreateTransactionParams>;

export interface Transaction {
  id: string;
  assetId: string; // Changed from 'type' to 'assetId' for better relationship modeling
  amount: number;
  recipient: string;
  status: TransactionStatus;
  metadata: Record<string, unknown>; // New required field - BREAKING CHANGE
  createdAt: Date;
  updatedAt: Date;
  // New fields may be added in breaking change tests
}

export interface TransactionResult {
  success: boolean;
  transactionId: string;
  blockHash: string;
  timestamp: Date;
  // This interface may change in breaking change tests
}

// Asset types - structures may change in breaking change tests
export enum AssetType {
  EQUITY = 'equity',
  DEBT = 'debt',
  FUND = 'fund',
  COMMODITY = 'commodity',
}

export interface AssetMetadata {
  name: string;
  symbol: string;
  type: AssetType;
  totalSupply: number;
  decimals?: number;
  description?: string;
  website?: string;
  logo?: string;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  totalSupply: number;
  decimals: number;
  createdAt: Date;
  metadata: {
    description?: string;
    website?: string;
    logo?: string;
  };
}

// API types - may be restructured in breaking change tests
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
