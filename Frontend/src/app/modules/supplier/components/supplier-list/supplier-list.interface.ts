import { ISupplier } from '../../../../shared/interfaces/supplier.interface';

export interface ISupplierRow {
  id?: number;
  name: string;
  email: string;
  phone: string;
  productsCount: number;
  productsLabel: string;
  products: ISupplier['products'];
}

export interface SupplierListFilters {
  search: string;
}
