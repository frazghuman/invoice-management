export interface CustomerJsonResponse {
    customers: Customer[];
    total: number;
    skip: number;
    limit: number;
}
  
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  cif: string;
  nif: string;
  address: string;
  additionalInformation: string;
  image: string;
  deleted: boolean;
  createdAt: string; // Alternatively, you can use Date if you plan to convert strings to Date objects
  updatedAt: string; // Alternatively, you can use Date here as well
}
  
  
export interface CustomersPaginator {
    customers: Customer[];
    page: number;
    hasMorePages: boolean;
}