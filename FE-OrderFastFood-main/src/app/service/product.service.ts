import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Product} from '../models/entity/product';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/';

  private productUrl = 'http://localhost:8080/api/product';

  constructor(private httpClient: HttpClient) { }

  getAllProduct(thePage: number, thePageSize: number): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/all?` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getNewProduct(thePage: number, thePageSize: number): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/new?` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductsByPriceDesc(thePage: number, thePageSize: number): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/price-desc?` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductsByPriceAsc(thePage: number, thePageSize: number): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/price-asc?` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductByName(thePage: number, thePageSize: number, name: string): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/search?` + `name=${name}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductByCategory(thePage: number, thePageSize: number, id: number): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/filter?` + `categoryId=${id}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductByCategoryAndName(thePage: number, thePageSize: number, id: number, name: string): Observable<GetResponseProducts>{
    const url = `${this.productUrl}/filter-category-name?` + `categoryId=${id}&name=${name}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductById(id: number): Observable<Product>{
    const url = `${this.productUrl}/${id}`;
    return this.httpClient.get<Product>(url);
  }

  getProductByCategoryId(id: number): Observable<Product[]>{
    const url = `${this.productUrl}/category/${id}`;
    return this.httpClient.get<[]>(url);
  }

  saveProduct(product: Product): Observable<any>{
    return this.httpClient.post<Product>(this.productUrl, product).pipe(catchError(this.handleError));
  }

  updateProduct(product: Product, id: number): Observable<any>{
    const url = `${this.productUrl}/${id}`;
    return this.httpClient.put<Product>(url, product).pipe(catchError(this.handleError));
  }

  deleteProduct(id: number){
    const url = `${this.productUrl}/${id}`;
    return this.httpClient.delete(url).pipe(catchError(this.handleError));
  }

  handleError(err){
    return throwError(err.message || 'serve error');
  }
}


interface GetResponseProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

