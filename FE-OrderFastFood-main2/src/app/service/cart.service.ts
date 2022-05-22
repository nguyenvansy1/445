import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {CartDetail} from '../models/entity/cart-detail';
import {Cart} from '../models/entity/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl = 'http://localhost:8080/api/cart';

  private cartDetailUrl = 'http://localhost:8080/api/cart-detail';

  totalCartItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  data: Observable<number> = this.totalCartItems.asObservable();

  setData(total: number) {
    this.totalCartItems.next(total);
  }

  constructor(private httpClient: HttpClient) { }

  getAllCartByUserId(userId: number): Observable<Cart[]>{
    const url = `${this.cartUrl}/user/${userId}`;
    return this.httpClient.get<Cart[]>(url);
  }

  getCartDetailByCartId(cartId: number): Observable<CartDetail[]>{
    const url = `${this.cartDetailUrl}/cart/${cartId}`;
    return this.httpClient.get<CartDetail[]>(url);
  }

  getCartDetailById(id: number): Observable<CartDetail>{
    const url = `${this.cartDetailUrl}/${id}`;
    return this.httpClient.get<CartDetail>(url);
  }

  updateCartDetail(cartDetail: CartDetail): Observable<any>{
    return this.httpClient.put<CartDetail>(this.cartDetailUrl, cartDetail).pipe(catchError(this.handleError));
  }

  saveCartDetail(cartDetail: CartDetail): Observable<any>{
    return this.httpClient.post<CartDetail>(this.cartDetailUrl, cartDetail).pipe(catchError(this.handleError));
  }

  deleteCartDetail(id: number){
    const url = `${this.cartDetailUrl}/${id}`;
    return this.httpClient.delete(url).pipe(catchError(this.handleError));
  }

  handleError(err){
    return throwError(err.message || 'serve error');
  }

}



