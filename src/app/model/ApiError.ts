export interface ApiError {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  detail: string;
  path: string;
}
