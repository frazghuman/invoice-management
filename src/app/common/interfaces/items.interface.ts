export interface ItemsJsonResponse {
    products: Item[];
    total: number;
    skip: number;
    limit: number;
}
  
export interface Item {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
  }
  
  
export interface ItemsPaginator {
    products: Item[];
    page: number;
    hasMorePages: boolean;
}