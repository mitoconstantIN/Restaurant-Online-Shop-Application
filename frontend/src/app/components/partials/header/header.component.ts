import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartQuantity = 0;
  user: User = new User();  // Initialize to avoid undefined user
  isAuthStatus: boolean = false; // Track auth status

  constructor(
    private router: Router,
    cartService: CartService,
    private userService: UserService
  ) {
    // Subscribe to cart updates
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
      console.log('Cart quantity updated:', this.cartQuantity);
    });

    // Subscribe to user updates
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      this.isAuthStatus = !!newUser.token; // Update isAuthStatus
      console.log('Authentication status:', this.isAuthStatus);
    });
  }

  // Navigate methods
  navigateToCart() {
    this.router.navigate(['/cart-page']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  logout() {
    console.log('Logging out...');
    this.userService.logout();
    this.user = new User();  // Clear user data after logout
    this.isAuthStatus = false; // Set auth status to false
  }

  // Getter to check if user is authenticated
  get isAuth() {
    const hasToken = !!this.user?.token;  // Safely check if token exists
    return hasToken;
  }
}
