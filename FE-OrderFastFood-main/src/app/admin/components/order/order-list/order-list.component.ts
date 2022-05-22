import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../../service/token-storage.service';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../../../service/cart.service';
import {User} from '../../../../models/entity/user';
import {Order} from '../../../../models/entity/order';
import {OrderService} from '../../../../service/order.service';
import {ProductCategory} from '../../../../models/entity/product-category';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  index = 1;
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;
  itemPerPage = 1;

  currentCategoryId = 1;
  previousCategoryId: number;
  productCategory: ProductCategory[] = [];
  previousKeyword: string = null;

  user: User;
  orders: Order[];
  order: Order;

  constructor(private router: Router,
              private tokenStorageService: TokenStorageService,
              private orderService: OrderService,
              private toastr: ToastrService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin(){
    this.user = this.tokenStorageService.getUser();
    if (this.user != null) {
      this.getOrder();
    }else{
      this.router.navigate(['/login']);
    }
  }

  getOrder(){
    this.orderService.getAllOrder(0, 20).subscribe(data => {
      this.orders = data.content;
      console.log(this.order);
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    });
  }

  finish() {
    this.ngOnInit();
  }
}
