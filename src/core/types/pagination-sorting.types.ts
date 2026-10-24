export type PaginationSorting = {
  sortBy: string; //Default value : createdAt
  sortDirection: 'asc' | 'desc'; //Default value: desc
  pageNumber: number; //Default value : 1
  pageSize: number; //Default value : 10
};
