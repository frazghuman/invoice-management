export interface UserJsonResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}
  
export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string,
    designation: string;
    role: any;
    companiesAccess: any[],
    image: string;
    verified: boolean;
    createdAt: Date,
    updatedAt: Date,
  }
  
  
export interface UsersManagementPaginator {
    users: User[];
    page: number;
    hasMorePages: boolean;
}