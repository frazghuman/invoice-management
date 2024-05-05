export interface CompaniesJsonResponse {
    companies: Company[];
    total: number;
    skip: number;
    limit: number;
}

export interface Company {
    _id: string;
    name: string;
    email: string;
    phone: string;
    businessNo: string;
    address: string;
    cif: string;
    logo: string;
    deleted: boolean;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}
  
  
export interface CompaniesManagementPaginator {
    companies: Company[];
    page: number;
    hasMorePages: boolean;
}