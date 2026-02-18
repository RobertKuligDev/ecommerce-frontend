import { Component, OnInit } from '@angular/core';
import { ICategory } from '../shared/models/category';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categories: ICategory[] = [];
  featuredProducts: IProduct[] = [];
  loading = false;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
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

  loadFeaturedProducts(): void {
    this.loading = true;
    const shopParams: ShopParams = {
      categoryId: 0,
      sort: 'name',
      pageNumber: 1,
      pageSize: 10,
      search: ''
    };
    this.shopService.getProduct(shopParams).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.featuredProducts = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src.indexOf('placeholder-product.svg') === -1) {
      imgElement.src = 'assets/images/placeholder-product.svg';
    }
  }
}
