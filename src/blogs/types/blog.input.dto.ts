export type BlogInput = {
  name: string; //maxLength: 15
  description: string; //maxLength: 500
  websiteUrl: string; //maxLength: 100 pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
  searchNameTerm: string; //Search term for blog Name: Name should contains this term in any position  Default value : null
  sortBy: string; //Default value : createdAt
  sortDirection: 'asc' | 'desc'; //Default value: desc
  pageNumber: number; //Default value : 1
  pageSize: number; //Default value : 10
};
