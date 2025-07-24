import { describe, it, expect } from 'vitest';
import { ErrorHandler, PolymeshError } from './ErrorHandler.js';

describe('ErrorHandler', () => {
  const errorHandler = new ErrorHandler();

  describe('createError', () => {
    it('should create a PolymeshError with correct properties', () => {
      const error = errorHandler.createError('TRANSACTION_NOT_FOUND', 'Test message');

      expect(error).toBeInstanceOf(PolymeshError);
      expect(error.code).toBe('TRANSACTION_NOT_FOUND');
      expect(error.message).toBe('Test message');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should preserve cause when provided', () => {
      const cause = new Error('Original error');
      const error = errorHandler.createError('UNKNOWN_ERROR', 'Test message', cause);

      expect(error.cause).toBe(cause);
    });
  });

  describe('handle', () => {
    it('should return PolymeshError as-is', () => {
      const originalError = new PolymeshError('ASSET_NOT_FOUND', 'Asset not found');
      const handledError = errorHandler.handle(originalError);

      expect(handledError).toBe(originalError);
    });

    it('should wrap regular Error in PolymeshError', () => {
      const originalError = new Error('Regular error');
      const handledError = errorHandler.handle(originalError);

      expect(handledError).toBeInstanceOf(PolymeshError);
      expect(handledError.code).toBe('UNKNOWN_ERROR');
      expect(handledError.message).toBe('Regular error');
      expect(handledError.cause).toBe(originalError);
    });

    it('should handle unknown error types', () => {
      const handledError = errorHandler.handle('string error');

      expect(handledError).toBeInstanceOf(PolymeshError);
      expect(handledError.code).toBe('UNKNOWN_ERROR');
      expect(handledError.message).toBe('An unknown error occurred');
    });
  });

  describe('isPolymeshError', () => {
    it('should return true for PolymeshError instances', () => {
      const error = new PolymeshError('VALIDATION_ERROR', 'Test');
      expect(errorHandler.isPolymeshError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const error = new Error('Regular error');
      expect(errorHandler.isPolymeshError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(errorHandler.isPolymeshError('string')).toBe(false);
      expect(errorHandler.isPolymeshError(null)).toBe(false);
      expect(errorHandler.isPolymeshError(undefined)).toBe(false);
    });
  });
});
