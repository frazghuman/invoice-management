export interface InvoicesJsonResponse {
    invoices: Invoice[];
    total: number;
    skip: number;
    limit: number;
}
  
export interface Invoice {
    id: number;
    products: Product[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
  }
  
export interface Product {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedPrice: number;
    thumbnail: string;
  }
  
  
  
export interface InvoicesPaginator {
    invoices: Invoice[];
    page: number;
    hasMorePages: boolean;
}