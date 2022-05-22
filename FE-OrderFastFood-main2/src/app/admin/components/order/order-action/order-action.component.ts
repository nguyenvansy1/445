import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {CartDetail} from '../../../../models/entity/cart-detail';
import {Cart} from '../../../../models/entity/cart';
import {User} from '../../../../models/entity/user';
import {CartService} from '../../../../service/cart.service';
import {TokenStorageService} from '../../../../service/token-storage.service';
import {Order} from '../../../../models/entity/order';
import {OrderDetail} from '../../../../models/entity/order-detail';
import {ToastrService} from 'ngx-toastr';
import {OrderService} from '../../../../service/order.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-action',
  templateUrl: './order-action.component.html',
  styleUrls: ['./order-action.component.css']
})
export class OrderActionComponent implements OnInit {

  @Input() orderId!: number;
  @Output()
  updateFinish: EventEmitter<any> = new EventEmitter<any>();

  order: Order;

  orderDetails: OrderDetail[];

  constructor(private modalService: NgbModal,
              private orderService: OrderService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log(this.orderId);
    this.getOrderDetail();
    this.getOrder();
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  getOrder(){
    this.orderService.getOrdersById(this.orderId).subscribe(data => {
      this.order = data;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    });
  }

  getOrderDetail(){

    this.orderService.getOrdersDetailByOrderId(this.orderId).subscribe(data => {
      this.orderDetails = data;
      console.log('dddd', this.orderDetails);

    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống djfgkdfg');
    });

  }

  confirm(){
    Swal.fire({
      title: 'Bạn muốn xác nhận đơn hàng này ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.getOrdersById(this.order.id).subscribe(data => {
          this.order = data;
          this.order.status = 2
          this.orderService.updateOrder(this.order).subscribe(data => {
              this.toastr.success('Xác nhận thành công!', 'Hệ thống');
              this.updateFinish.emit('done');
              this.modalService.dismissAll();
              this.ngOnInit();
            }, error => {
              this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
            }
          );

        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        });
      }
    });

  }

  cancel(){
    Swal.fire({
      title: 'Bạn có muốn huỷ đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Huỷ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.getOrdersById(this.order.id).subscribe(data => {
          this.order = data;
          this.order.status = 0
          this.orderService.updateOrder(this.order).subscribe(data => {
              this.toastr.success('Huỷ thành công !', 'Hệ thống');
              this.updateFinish.emit('done');
              this.modalService.dismissAll();
              this.ngOnInit();
            }, error => {
              this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
            }
          );

        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        });
      }
    });

  }

  paid(){
    Swal.fire({
      title: 'Bạn muốn xác nhận đơn hàng này đã thanh toán?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.getOrdersById(this.order.id).subscribe(data => {
          this.order = data;
          this.order.status = 3;
          this.orderService.updateOrder(this.order).subscribe(data => {
              this.toastr.success('Xác nhận thành công!', 'Hệ thống');
              this.updateFinish.emit('done');
              this.modalService.dismissAll();
              this.ngOnInit();
            }, error => {
              this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
            }
          );

        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        });
      }
    });

  }

}
