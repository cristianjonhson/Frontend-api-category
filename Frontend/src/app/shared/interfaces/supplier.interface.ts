export interface ISupplierProduct {
  id?: number;
  name: string;
  categoryName?: string;
}

export interface ISupplier {
  id?: number;
  name: string;
  email: string;
  phone: string;
  products: ISupplierProduct[];
}

export interface ISupplierRequest {
  name: string;
  email: string;
  phone: string;
}
