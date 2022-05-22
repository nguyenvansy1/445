import {CartDetail} from './cart-detail';
import {User} from './user';

export class Cart {
  id: number;
  amount: number;
  user: User;
  cartDetails: CartDetail[];
}
