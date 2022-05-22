import { Injectable } from '@angular/core';
import {Order} from '../models/entity/order';
import {Observable, throwError} from 'rxjs';
import {OrderDetail} from '../models/entity/order-detail';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl = 'http://localhost:8080/api/order';

  private orderDetailUrl = 'http://localhost:8080/api/order-detail';

  constructor(private httpClient: HttpClient) { }

  getOrdersByUserId(userId: number, thePage: number, thePageSize: number): Observable<GetResponseOrder>{
    const url = `${this.orderUrl}/user?`  + `userId=${userId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseOrder>(url);
  }

  getAllOrder(thePage: number, thePageSize: number): Observable<GetResponseOrder>{
    const url = `${this.orderUrl}/all?`  + `page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseOrder>(url);
  }

  getOrdersById(orderId: number): Observable<Order>{
    const url = `${this.orderUrl}/${orderId}` ;
    return this.httpClient.get<Order>(url);
  }

  getOrdersDetailByOrderId(orderId: number): Observable<OrderDetail[]>{
    const url = `${this.orderDetailUrl}/${orderId}` ;
    return this.httpClient.get<OrderDetail[]>(url);
  }

  saveOrder(order: Order): Observable<any>{
    return this.httpClient.post<Order>(this.orderUrl, order).pipe(catchError(this.handleError));
  }

  updateOrder(order: Order): Observable<any>{
    return this.httpClient.put<Order>(this.orderUrl, order).pipe(catchError(this.handleError));
  }

  saveOrderDetail(orderDetail: OrderDetail): Observable<any>{
    return this.httpClient.post<OrderDetail>(this.orderDetailUrl, orderDetail).pipe(catchError(this.handleError));
  }

  handleError(err){
    return throwError(err.message || 'serve error');
  }

}

interface GetResponseOrder {
  content: Order[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;

}

