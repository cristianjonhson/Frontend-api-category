export interface IProduct {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  categoryId?: number;
  categoryName?: string;
  category?: string | { id?: number; name?: string };
}

export interface IProductRequest {
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}
