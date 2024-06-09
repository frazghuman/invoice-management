export interface ProposalsJsonResponse {
    proposals: Proposal[];
    total: number;
    skip: number;
    limit: number;
}
  
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  cif: string;
  nif: string;
  address: string;
  additionalInformation?: string;
  image?: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  company: string;
}

interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessNo: string;
  address: string;
  cif: string;
  logo?: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ItemDetails {
  _id: string;
  name: string;
  description: string;
  baseUnitOfMeasure: string;
  image: string;
  deleted: boolean;
  prices: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalItem {
  _id: string;
  item: ItemDetails;
  price: number;
  quantity: number;
}

export interface Proposal {
  _id: string;
  isSent: boolean;
  customer: Customer;
  company: Company;
  date: Date;
  dueDate: Date;
  items: ProposalItem[];
  discount: number;
  shippingCharges: number;
  amountDue: number;
  subTotal?: number;
  note?: string;
  isBill: boolean;
  isPaid: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
  
  
  
export interface ProposalsPaginator {
    proposals: Proposal[];
    page: number;
    hasMorePages: boolean;
}