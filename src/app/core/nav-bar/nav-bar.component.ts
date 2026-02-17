import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { filter, Observable } from 'rxjs';
import { IBasket } from '../../shared/models/basket';
import { AccountService } from '../../account/account.service';
import { IUser } from '../../shared/models/user';

/**
 * Component responsible for displaying the navigation bar.
 * Shows the basket items count and login/logout actions based on user authentication state.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {

  basket$!: Observable<IBasket>;  // Observable for the current state of the user's basket
  currentUser$!: Observable<IUser>; // Observable for the current authenticated user

  constructor(
    private basketService: BasketService,
    private accountService: AccountService
  ) {}

  /**
   * Initializes component data streams for basket and user state.
   */
  ngOnInit(): void {
    // Sets up an observable to listen for changes in the user's basket
    this.basket$ = this.basketService.basket$.pipe(
      filter((basket): basket is IBasket => basket !== null)
    );

    // Sets up an observable to listen for changes in the user's authentication state
    this.currentUser$ = this.accountService.currentUser$.pipe(
      filter((user): user is IUser => user !== null)
    );
  }

  /**
   * Logs the user out by calling the logout method in AccountService.
   */
  logout() {
    this.accountService.logout();
  }
}
