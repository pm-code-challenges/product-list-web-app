import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private serverUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) { }

  getProducts(apiFilters: any): Observable<Product[]> {
    // const url = this.serverUrl + '/products?sortBy='+ sortField +'&sortDir='+ sortDirection;
    const url = this.serverUrl + '/products';
    return this.http.get<Product[]>(url, {
      params: apiFilters
    });
  }
}
