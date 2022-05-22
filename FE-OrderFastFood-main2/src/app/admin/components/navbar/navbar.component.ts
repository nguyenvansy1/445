import { Component, OnInit } from '@angular/core';
import {CartDetail} from '../../../models/entity/cart-detail';
import {Cart} from '../../../models/entity/cart';
import {User} from '../../../models/entity/user';
import {TokenStorageService} from '../../../service/token-storage.service';
import {CartService} from '../../../service/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  totalCartItem: number;
  isLoggedIn = false;
  cartDetail: CartDetail[];
  cart: Cart;
  user: User;

  constructor(private cartService: CartService,
              private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.cartService.data.subscribe(data => {
      this.totalCartItem = data;
    });
    this.getUser();
  }

  getUser(){
    this.user = this.tokenStorageService.getUser();

    if (this.user == null) {
      this.cartService.setData(0);
    }else{
      this.getTotalCartItem();
    }
  }

  getTotalCartItem(){
    this.cartService.getAllCartByUserId(this.user.id).subscribe(data => {
      this.cart = data[0];
      this.cartDetail = this.cart.cartDetails;
      this.cartService.setData(this.cartDetail.length);
    }, error => {
      alert('handle error');
    });
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
