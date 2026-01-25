import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products = [
    { name: 'Producto 1', price: 100, category: 'Electrónica' },
    { name: 'Producto 2', price: 200, category: 'Hogar' },
    { name: 'Producto 3', price: 300, category: 'Deportes' },
  ];

  getProducts(): Observable<any[]> {
    return of(this.products);
  }
}
