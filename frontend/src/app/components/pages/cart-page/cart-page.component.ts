import { Component } from '@angular/core';
import { Cart } from '../../../shared/models/Cart';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../shared/CartItem';
import { TitleComponent } from '../../partials/title/title.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotFoundComponent } from "../../partials/not-found/not-found.component";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [TitleComponent, TitleComponent, CommonModule, RouterLink, NotFoundComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cart!: Cart;
  constructor(private cartService: CartService){
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    })
  }

  removeFromCart(cartItem:CartItem){
    this.cartService.removeFromCart(cartItem.food.id);
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.changeQuantity(cartItem.food.id, cartItem.quantity + 1);
  }

  decrementQuantity(cartItem: CartItem) {
    if (cartItem.quantity > 1) {
        this.cartService.changeQuantity(cartItem.food.id, cartItem.quantity - 1);
    }
  }
  changeQuantity(cartItem:CartItem, quantityInString:string){
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food.id, quantity);
  }
}
