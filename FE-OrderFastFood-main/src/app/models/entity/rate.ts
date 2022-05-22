import {Product} from './product';
import {User} from './user';

export class Rate {
  id: number;
  start: number;
  comment: string;
  dateRate: Date;
  // product: Product;
  productId: number;
  // user: User;
  userId: number;


  // constructor(start: number, comment: string, productId: number, user: User) {
  //   this.start = start;
  //   this.comment = comment;
  //   this.productId = productId;
  //   this.user = user;
  // }

  constructor(start: number, comment: string, productId: number, userId: number) {
    this.start = start;
    this.comment = comment;
    // this.product = productId;
    this.productId = productId;
    this.userId = userId;
    // this.user = userId;
  }
}
