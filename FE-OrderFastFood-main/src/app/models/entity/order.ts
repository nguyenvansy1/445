import {User} from './user';
import {OrderDetail} from './order-detail';

export class Order {
  id: number;
  name: string;
  address: string;
  phone: string;
  amount: number;
  orderTrackingNumber: string;
  description: string;
  status: number;
  dateOrdered: Date;
  dateDeliveryDate: Date;
  dateReceipt: Date;
  user: User;
  orderDetails: OrderDetail;

  constructor(amount: number, name: string, address: string, phone: string, status: number, user: User, description: string ) {
    this.amount = amount;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.status = status;
    this.user = user;
    this.description = description;
  }

}
