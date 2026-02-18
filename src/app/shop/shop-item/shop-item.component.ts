import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent implements OnInit {
  @Input() product: IProduct | undefined;

  constructor(private basketService: BasketService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  addItemToBasket() {
    if (this.product) {
      this.basketService.addItemToBasket(this.product);
    } else {
      this.toastr.error('Product is undefined', 'Error');
    }
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src !== window.location.origin + '/assets/images/placeholder-product.svg') {
      imgElement.src = 'assets/images/placeholder-product.svg';
    }
  }
}
