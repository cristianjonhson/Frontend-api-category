import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private products = [
    { name: 'Producto 1', price: 100, category: 'Electrónica', quantity: 10 },
    { name: 'Producto 2', price: 200, category: 'Hogar', quantity: 5 },
    { name: 'Producto 3', price: 300, category: 'Deportes', quantity: 20 },
  ];

  getProducts(): Observable<any[]> {
    return of([...this.products]);
  }

  createProduct(payload: any): Observable<any> {
    const created = { ...payload };
    this.products = [created, ...this.products];
    return of(created);
  }

}
