import {Cart} from './cart';
import {Product} from './product';

export class CartDetail {
    id: number;
    quantity: number;
    cart: Cart;
    product: Product;

    constructor(quantity: number, product: Product, cart: Cart) {
        this.quantity = quantity;
        this.product = product;
        this.cart = cart;
    }
}
