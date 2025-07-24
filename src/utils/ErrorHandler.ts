export type ErrorCode =
  | 'TRANSACTION_NOT_FOUND'
  | 'ASSET_NOT_FOUND'
  | 'INSUFFICIENT_ASSET_SUPPLY'
  | 'INVALID_AMOUNT'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

export class PolymeshError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: Date;

  constructor(code: ErrorCode, message: string, cause?: Error) {
    super(message);
    this.name = 'PolymeshError';
    this.code = code;
    this.timestamp = new Date();

    if (cause) {
      this.cause = cause;
    }
  }
}

export class ErrorHandler {
  createError(code: ErrorCode, message: string, cause?: Error): PolymeshError {
    return new PolymeshError(code, message, cause);
  }

  handle(error: unknown): PolymeshError {
    if (error instanceof PolymeshError) {
      return error;
    }

    if (error instanceof Error) {
      return new PolymeshError('UNKNOWN_ERROR', error.message, error);
    }

    return new PolymeshError('UNKNOWN_ERROR', 'An unknown error occurred');
  }

  isPolymeshError(error: unknown): error is PolymeshError {
    return error instanceof PolymeshError;
  }
}
