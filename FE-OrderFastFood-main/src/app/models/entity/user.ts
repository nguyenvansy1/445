import {Cart} from './cart';
import {Rate} from './rate';

export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  address: string;
  gender: string;
  phone: string;
  active: boolean;

  carts: Cart[];
  rates: Rate[];
  dateCreated: Date;
  lastUpdated: Date;
}
