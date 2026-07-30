export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  error?: string;
  path?: string;
  timestamp?: string;
  details?: string[] | Record<string, unknown>;
}
