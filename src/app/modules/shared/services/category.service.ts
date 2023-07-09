import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

//call environment, declare constant
const base_url = environment.base_uri;
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
    /**
     * get all categories
     * @returns get all categories existing
     */
  getCategories(){
      // endpoint 
      const endpoint =`${base_url}/categories`;
      return this.http.get(endpoint);
    }
}