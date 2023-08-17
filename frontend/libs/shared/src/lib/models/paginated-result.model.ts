export interface PaginatedResult<T> {
  content: T[];
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}
