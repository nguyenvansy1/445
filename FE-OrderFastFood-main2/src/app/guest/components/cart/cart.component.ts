import {Component, ElementRef, OnInit, ViewChild , NgZone} from '@angular/core';
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
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @ViewChild('myinputFirst') myinputFirst: ElementRef;
  @ViewChild('myinputLast') myinputLast: ElementRef;
  title = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address1: string;
  private geoCoder;
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

  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private cartService: CartService,
              private tokenStorageService: TokenStorageService,
              private router: Router,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // tslint:disable-next-line:new-parens
      this.geoCoder = new google.maps.Geocoder;
    });
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

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address1 = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
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
      title: 'B???n mu???n xo?? s???n ph???m n??y ra kh???i gi??? h??ng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Kh??ng',
      confirmButtonText: 'Xo??'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteCartDetail(id).subscribe(
          (data) => {
            this.toastr.success('Xo?? th??nh c??ng!', 'H??? th???ng');
            this.ngOnInit();
          }, (error) => {
            this.toastr.error('Xo?? th???t b???i! ' + error.status, 'H??? th???ng');
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
          this.toastr.error('L???i! ' + error.status, 'H??? th???ng');
        });
      });
    }, (error) => {
      this.toastr.error('L???i! ' + error.status, 'H??? th???ng');
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
      title: 'B???n c?? mu???n ?????t ????n h??ng n??y?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Kh??ng',
      confirmButtonText: '?????t'
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
              this.toastr.error('H??? th???ng - 2');
            });
          });
        }, error => {
          this.toastr.error('H??? th???ng -sdfsfsf');
        });
        this.deleteAll();
        this.CheckoutFormGroup.reset();
        Swal.fire(
          'Th??nh c??ng!',
          'Ch??c m???ng b???n ???? ?????t h??ng th??nh c??ng.',
          'success'
        );
      }
    });
  }

}
