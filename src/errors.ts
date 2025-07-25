// Updated error structure - BREAKING CHANGE
export interface ErrorResponse {
  code: string;
  message: string;
  context: Record<string, any>; // New field - BREAKING CHANGE
  timestamp: Date; // New field - BREAKING CHANGE
}