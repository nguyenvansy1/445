import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CartDetail} from '../../../models/entity/cart-detail';
import {Cart} from '../../../models/entity/cart';
import {User} from '../../../models/entity/user';
import {Order} from '../../../models/entity/order';
import {OrderDetail} from '../../../models/entity/order-detail';
import {ToastrService} from 'ngx-toastr';
import {TokenStorageService} from '../../../service/token-storage.service';
import {Router} from '@angular/router';
import {OrderService} from '../../../service/order.service';
import {CartService} from '../../../service/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @ViewChild('myinputFirst') myinputFirst: ElementRef;
  @ViewChild('myinputLast') myinputLast: ElementRef;

  submitted = false;
  CheckoutFormGroup: FormGroup;
  totalItem = 0;
  amount = 0;
  cartDetails: CartDetail[];
  cartDetail: CartDetail;
  cart: Cart;
  user: User;

  totalCartItem: number;

  order: Order;
  orderDetail: OrderDetail;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private cartService: CartService,
              private tokenStorageService: TokenStorageService,
              private router: Router,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.cartService.data.subscribe(data => {
      this.totalCartItem = data;
    });

    this.CheckoutFormGroup = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required , Validators.pattern('(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})')]),
        address: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.maxLength(255)]),
      },
    );
  }


  get name() { return this.CheckoutFormGroup.get('name'); }
  get address() { return this.CheckoutFormGroup.get('address'); }
  get phoneNumber() { return this.CheckoutFormGroup.get('phoneNumber'); }
  get description() { return this.CheckoutFormGroup.get('description'); }



  onShiftKey(event: KeyboardEvent) {
    event.preventDefault();
    if (event.shiftKey && event.key === 'Tab') {
      this.myinputLast.nativeElement.focus();
    }
  }

  onKey(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'Tab') {
      this.myinputFirst.nativeElement.focus();
    }
  }

  ngAfterViewInit() {
    this.myinputFirst.nativeElement.focus();
  }

  checkLogin(){
    this.user = this.tokenStorageService.getUser();
    if (this.user != null) {
      this.amount = 0;
      this.totalItem = 0;
      this.loadCartDetail();
    }else{
      this.router.navigate(['/login']);
    }
  }

  loadCartDetail(){
    this.cartService.getAllCartByUserId(this.user.id).subscribe(data => {
      this.cart = data[0];
      this.cart.cartDetails.sort((a, b) => a.id - b.id);
      this.cartDetails = this.cart.cartDetails;
      this.cartDetails.forEach(item => {
        this.totalItem += item.quantity;
        this.amount += item.quantity * item.product.unitPrice;
      });
      this.cartService.setData(this.totalItem);
    });
  }

  update(id: number, quantity: number){
    this.cartService.getCartDetailById(id).subscribe(data => {
      this.cartDetail = data;
      this.cartDetail.quantity = quantity;
      this.cartService.updateCartDetail(this.cartDetail).subscribe(data => {
        this.ngOnInit();

      }, error => {
        alert('handle error');
      });
    }, error => {
      alert('handle error');
    });

  }
  delete(id){
    Swal.fire({
      title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Xoá'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteCartDetail(id).subscribe(
          (data) => {
            this.toastr.success('Xoá thành công!', 'Hệ thống');
            this.ngOnInit();
          }, (error) => {
            this.toastr.error('Xoá thất bại! ' + error.status, 'Hệ thống');
          }
        );

      }
    });
  }

  deleteAll(){

    this.cartService.getAllCartByUserId(this.user.id).subscribe(data => {
      this.cart = data[0];
      this.cart.cartDetails.sort((a, b) => a.id - b.id);
      this.cartDetails = this.cart.cartDetails;
      this.cartDetails.forEach( item => {
        this.cartService.deleteCartDetail(item.id).subscribe( (data) => {
          this.ngOnInit();
        }, (error) => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        });
      });
    }, (error) => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    });

  }

  enableSubmited(){
    this.submitted = true;
  }



  onSubmit() {

    this.submitted = true;


    if (this.CheckoutFormGroup.invalid) {

      this.CheckoutFormGroup.markAllAsTouched();
      this.ngOnInit();

      return;
    }

    console.log(this.CheckoutFormGroup.value);


    Swal.fire({
      title: 'Bạn có muốn đặt đơn hàng này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Đặt'
    }).then((result) => {
      if (result.isConfirmed) {
        const user = new User();
        user.id = this.user.id;
        this.order = new Order(this.amount, this.CheckoutFormGroup.value.name,
          this.CheckoutFormGroup.value.address, this.CheckoutFormGroup.value.phoneNumber, 1,
          user, this.CheckoutFormGroup.value.description );
        this.orderService.saveOrder(this.order).subscribe(data => {
          this.order = data;
          this.cartDetails.forEach(item => {
            this.orderDetail = new OrderDetail(item.quantity, item.product, this.order);
            this.orderService.saveOrderDetail(this.orderDetail).subscribe(data => {
              console.log('done');
            }, error => {
              this.toastr.error('Hệ thống - 2');
            });
          });
        }, error => {
          this.toastr.error('Hệ thống -sdfsfsf');
        });
        this.deleteAll();
        this.CheckoutFormGroup.reset();
        Swal.fire(
          'Thành công!',
          'Chúc mừng bạn đã đặt hàng thành công.',
          'success'
        );
      }
    });
  }

}
