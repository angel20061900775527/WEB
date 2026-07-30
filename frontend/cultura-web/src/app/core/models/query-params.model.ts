export type SortDirection = 'asc' | 'desc';

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}
