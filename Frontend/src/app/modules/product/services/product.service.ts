import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private products = [
    { id: 1, name: 'Producto 1', price: 100, category: 'Electrónica', quantity: 10 },
    { id: 2, name: 'Producto 2', price: 200, category: 'Hogar', quantity: 5 },
    { id: 3, name: 'Producto 3', price: 300, category: 'Deportes', quantity: 20 },
  ];

  getProducts(): Observable<any[]> {
    return of([...this.products]);
  }

  createProduct(payload: any): Observable<any> {
    const maxId = this.products.reduce((max, product) => Math.max(max, product.id ?? 0), 0);
    const created = { id: maxId + 1, ...payload };
    this.products = [created, ...this.products];
    return of(created);
  }

  deleteProduct(id: number): Observable<void> {
    this.products = this.products.filter(product => product.id !== id);
    return of(void 0);
  }

}
