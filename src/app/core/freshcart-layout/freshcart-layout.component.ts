import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../../shared/models/user';
import { IBasket } from '../../shared/models/basket';
import { ICategory } from '../../shared/models/category';
import { AccountService } from '../../account/account.service';
import { BasketService } from '../../basket/basket.service';
import { ShopService } from '../../shop/shop.service';

@Component({
  selector: 'app-freshcart-layout',
  templateUrl: './freshcart-layout.component.html',
  styleUrls: ['./freshcart-layout.component.scss']
})
export class FreshcartLayoutComponent implements OnInit {
  currentUser$: Observable<IUser | null>;
  basket$: Observable<IBasket | null>;
  categories: ICategory[] = [];
  searchForm: FormGroup;
  currentYear = new Date().getFullYear();

  constructor(
    private accountService: AccountService,
    private basketService: BasketService,
    private shopService: ShopService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.currentUser$ = this.accountService.currentUser$;
    this.basket$ = this.basketService.basket$;
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.shopService.getCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  logout(): void {
    this.accountService.logout();
  }

  onSearch(): void {
    const searchTerm = this.searchForm.get('search')?.value;
    if (searchTerm) {
      this.router.navigate(['/shop'], { queryParams: { search: searchTerm } });
    }
  }
}
