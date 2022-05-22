import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CartDetail} from '../../../models/entity/cart-detail';
import {Cart} from '../../../models/entity/cart';
import {Product} from '../../../models/entity/product';
import {ProductService} from '../../../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../../service/cart.service';
import {ProductCategoryService} from '../../../service/product-category.service';
import {TokenStorageService} from '../../../service/token-storage.service';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  isLoading = true;
  thePageNumber = 1;
  thePageSize = 20;
  theTotalElements = 0;
  itemPerPage = 1;

  @ViewChild('optionIst') optionIst: ElementRef;

  searchMode = false;
  sortMode = false;
  products: Product[];

  cart: Cart;
  cartDetail: CartDetail;
  keywordForSearch = '';
  valueForSort = '';
  isLoggedIn = false;
  totalItems = 0;

  constructor( private productService: ProductService,
               private routerActive: ActivatedRoute,
               private router: Router,
               public dialog: MatDialog,
               private toastr: ToastrService,
               private cartService: CartService,
               private productCategoryService: ProductCategoryService,
               private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.routerActive.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  doSearch(){
    this.thePageNumber = 1;
    this.searchMode = true;
    this.sortMode = false;
    this.optionIst.nativeElement.value = '';
    this.listProducts();
  }

  doFilter(value){
    this.thePageNumber = 1;
    this.sortMode = true;
    this.searchMode = false;
    this.keywordForSearch = '';
    this.valueForSort = value;
    this.listProducts();
  }

  listProducts(){
    if (this.searchMode){
      this.processSearch();
      return;
    }


    if (this.sortMode){
      this.processSort();
      return;
    }

    this.productService.getAllProduct(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());

  }

  processSort(){

    if (this.valueForSort === ''){
      this.productService.getAllProduct(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
      return;
    }

    if (this.valueForSort === 'enteredDate'){
      this.productService.getNewProduct(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
      return;
    }

    if (this.valueForSort === 'priceDesc'){
      this.productService.getProductsByPriceDesc(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
      return;
    }
    if (this.valueForSort === 'priceAsc'){
      this.productService.getProductsByPriceAsc(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
      return;
    }

  }

  processSearch(){
    this.productService.getProductByName(this.thePageNumber - 1, this.thePageSize,
      this.keywordForSearch).pipe(debounceTime(5000)).subscribe(this.processResult());
  }

  processResult() {
    return (data) => {
      this.isLoading = false;
      this.products = data.content; //
      this.thePageNumber = data.number + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
      this.processItemPerPage();
    };

  }

  processItemPerPage() {
    if (this.thePageNumber * this.thePageSize > this.theTotalElements) {
      this.itemPerPage = this.theTotalElements;
    } else {
      this.itemPerPage = this.thePageNumber * this.thePageSize;
    }
  }

  updatePageSize(pageSize) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  getStar(id: number){
    let product: Product;
    for (const tempProduct of this.products) {
      if (tempProduct.id === id){
        product = tempProduct;
        break;
      }
    }
    if (product.rates.length > 0){
      let rate = 0;
      for (const tempRate of product.rates) {
        rate += tempRate.start;
      }
      return rate / product.rates.length;
    }else{
      return 0;
    }
  }

  addCart(productId: number, price: number){

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const userid = this.tokenStorageService.getUser().id;

      this.cartService.getAllCartByUserId(userid).subscribe(data => {
        this.cart = data[0];


        let product = new Product();
        product.id = productId;
        let cart = new Cart();
        cart.id = this.cart.id;
        this.cartDetail = new CartDetail(1, product, cart);
        // tslint:disable-next-line:no-shadowed-variable
        this.cartService.saveCartDetail(this.cartDetail).subscribe(data => {
          this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
          // tslint:disable-next-line:no-shadowed-variable
          this.cartService.getCartDetailByCartId(this.cart.id).subscribe(data => {

            console.log(data);
            data.forEach(item => {
              this.totalItems += item.quantity;
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
}
