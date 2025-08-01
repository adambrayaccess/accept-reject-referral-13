
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}
