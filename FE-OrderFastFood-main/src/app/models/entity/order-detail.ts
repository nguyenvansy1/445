import {Order} from './order';
import {Product} from './product';

export class OrderDetail {
  id: number;
  quantity: number;
  order: Order;
  product: Product;

  constructor(quantity: number, product: Product, order: Order) {
    this.quantity = quantity;
    this.product = product;
    this.order = order;
  }
}
