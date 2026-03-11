import { ICategory, IProduct, ISupplier } from '../../../../shared/interfaces';

export interface ProductEditDialogData {
  product: IProduct;
  categories: ICategory[];
  suppliers: ISupplier[];
}
