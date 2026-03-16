export interface RawSupplierProduct {
  id?: number;
  name?: string;
  categoryName?: string;
}

export interface RawSupplier {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  products?: RawSupplierProduct[];
}

export interface SupplierApiBody {
  supplierResponse?: {
    supplier?: RawSupplier[] | RawSupplier;
  };
}
