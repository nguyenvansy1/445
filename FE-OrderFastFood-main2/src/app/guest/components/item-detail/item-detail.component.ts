import { Component, OnInit } from '@angular/core';
import {Rate} from '../../../models/entity/rate';
import {Product} from '../../../models/entity/product';
import {Cart} from '../../../models/entity/cart';
import {CartDetail} from '../../../models/entity/cart-detail';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../service/product.service';
import {TokenStorageService} from '../../../service/token-storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../../service/cart.service';
import {RateService} from '../../../service/rate.service';
import {User} from '../../../models/entity/user';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  rates: Rate[];
  products: Product[];
  cart: Cart;
  cartDetail: CartDetail;
  isLoggedIn = false;
  currentRate = 0;
  rate = 0;
  rateLength = 0;
  userId: number;
  user: User;
  content: string;

  isLoading = true;
  product: Product;
  productsSuggest: Product[];
  productId: number;
  totalItems = 0;

  constructor(private routeActive: ActivatedRoute,
              private productService: ProductService,
              private route: Router,
              private tokenStorageService: TokenStorageService,
              private router: Router,
              public dialog: MatDialog,
              private toastr: ToastrService,
              private cartService: CartService,
              private rateService: RateService) {}

  ngOnInit(): void {
    this.routeActive.paramMap.subscribe(() => {
      this.getProduct();
    });

  }

  getProduct(){
    this.productId = +this.routeActive.snapshot.paramMap.get('id');
    this.productService.getProductById(this.productId).subscribe(data => {
      this.product = data;
      console.log(data);
      this.productService.getProductByCategory(0, 5, this.product.category.id).subscribe(data => {
        this.productsSuggest = data.content;
      });
      this.getStar();
    });
  }

  getStar(){
    if (this.product.rates.length > 0){
      let rate = 0;
      let rateLength = 0;
      for (const tempRate of this.product.rates) {
        if (tempRate.start !== 0){
          rate += tempRate.start;
          rateLength += 1;
        }
      }
      this.rate = rate / rateLength;
      this.rateLength = rateLength;
      this.rates = this.product.rates;
      this.rateLength = this.products.length;
      console.log('hii');
      console.log(this.rateLength);
    }else{
      this.rate = 0;
      this.rateLength = 0;
    }

  }

  addCart(productId: number, price: number) {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const userid = this.tokenStorageService.getUser().id;
      this.cartService.getAllCartByUserId(userid).subscribe(data => {
        this.cart = data[0];

        const product = new Product();
        product.id = productId;
        const cart = new Cart();
        cart.id = this.cart.id;
        this.cartDetail = new CartDetail(1, product, cart);
        this.cartService.saveCartDetail(this.cartDetail).subscribe(next => {
          this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
          this.cartService.getCartDetailByCartId(this.cart.id).subscribe(data => {
            data.forEach(item => {
              this.totalItems += item.quantity;
              // console.log(this.totalItems);
              // this.cartService.updateCartDetail(new CartDetail(  , product, cart)).subscribe();
            });
            this.cartService.setData(this.totalItems);
            this.totalItems = 0;
          });
        }, error => {
          alert('handleError_1');
        });
      }, error => {
        alert('handleError');
      });
    }else{
      this.router.navigateByUrl('login');
    }

  }

  checkLogin(){
    this.user = this.tokenStorageService.getUser();
    if (this.user != null) {
      this.userId = this.user.id;
    }else{
      this.router.navigate(['/login']);
    }
  }

  addRates(userId, productId){
    this.checkLogin();
    console.log(userId + ' ' + productId + ' ' + this.content + ' ' + this.rate);
    const rate = new Rate( this.rate, this.content, productId, userId);
    this.rateService.saveRate(rate).subscribe(data => {
      this.toastr.success('Đánh giá sản phẩm thành công!', 'Hệ thống!');
    });
  }

}
