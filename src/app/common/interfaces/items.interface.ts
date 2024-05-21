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
    _id: string;
    name: string;
    description: string;
    baseUnitOfMeasure: number;
    image: string;
    prices?: Price[];
    latestPrice?: Price;
    inventoryCount?: number;
    inventories?: any[];
    totalAvailableStock?: number;
  }
  
  
export interface ItemsPaginator {
    items: Item[];
    page: number;
    hasMorePages: boolean;
}