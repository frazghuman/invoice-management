export interface ItemsJsonResponse {
    items: Item[];
    total: number;
    skip: number;
    limit: number;
}

interface Price {
    salePrice: number,
    effectiveDate: Date
}
  
export interface Item {
    _id: number;
    name: string;
    description: string;
    baseUnitOfMeasure: number;
    image: string;
    prices?: Price[];
    latestPrice?: Price
  }
  
  
export interface ItemsPaginator {
    items: Item[];
    page: number;
    hasMorePages: boolean;
}