import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Order} from '../../../models/entity/order';
import {OrderDetail} from '../../../models/entity/order-detail';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrderService} from '../../../service/order.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @Input() orderId!: number;

  order: Order;
  orderDetails: OrderDetail[];

  constructor(
    private modalService: NgbModal,
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

}

