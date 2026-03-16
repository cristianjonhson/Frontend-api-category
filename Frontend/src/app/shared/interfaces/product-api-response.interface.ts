export interface RawProductCategory {
  id?: number;
  name?: string;
}

export interface RawProduct {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  categoryId?: number;
  categoryName?: string;
  supplierId?: number;
  supplierName?: string;
  category?: string | RawProductCategory;
}

export interface ProductApiBody {
  productResponse?: {
    product?: RawProduct[] | RawProduct;
  };
}
