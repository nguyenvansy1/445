import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ProductCategory} from '../models/entity/product-category';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private baseUrl = 'http://localhost:8080/api/';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private http: HttpClient) { }

  getAllProductCategory(): Observable<ProductCategory[]>{
    return this.http.get<ProductCategory[]>(this.categoryUrl);
  }

  getAllProductCategoryPaginate(thePage: number, thePageSize: number): Observable<GetResponseProductsCategory>{
    const url = `${this.categoryUrl}/all?` + `&page=${thePage}&size=${thePageSize}`;
    return this.http.get<GetResponseProductsCategory>(url);
  }

  getProductCategoryById(id: number): Observable<ProductCategory>{
    const url = `${this.categoryUrl}/${id}`;
    return this.http.get<ProductCategory>(url);
  }

  getByName(name: string): Observable<ProductCategory>{
    const url = `${this.categoryUrl}/search?` + `&name=${name}`;
    return this.http.get<ProductCategory>(url);
  }

  saveProduct(product: ProductCategory): Observable<any>{
    return this.http.post<ProductCategory>(this.categoryUrl, product).pipe(catchError(this.handleError));
  }

  updateProduct(product: ProductCategory, id: number): Observable<any>{
    const url = `${this.categoryUrl}/${id}`;
    return this.http.put<ProductCategory>(url, product).pipe(catchError(this.handleError));
  }


  deleteProduct(id: number){
    const url = `${this.categoryUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  handleError(err){
    return throwError(err.message || 'serve error');
  }

}


interface GetResponseProductsCategory {
  content: ProductCategory[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;

}

