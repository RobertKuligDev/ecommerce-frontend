import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { IProduct } from '../../shared/models/product';
import { ICategory } from '../../shared/models/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  loading = false;
  showForm = false;
  editingProduct: IProduct | null = null;

  formModel: Partial<IProduct> = {
    name: '',
    description: '',
    price: 0,
    productPicture: '',
    categoryName: ''
  };

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.adminService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load products', 'Error');
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  openForm(product?: IProduct): void {
    if (product) {
      this.editingProduct = product;
      this.formModel = { ...product };
    } else {
      this.editingProduct = null;
      this.formModel = {
        name: '',
        description: '',
        price: 0,
        productPicture: '',
        categoryName: ''
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingProduct = null;
  }

  saveProduct(): void {
    if (!this.formModel.name || !this.formModel.price) {
      this.toastr.error('Please fill in required fields', 'Error');
      return;
    }

    if (this.editingProduct) {
      this.adminService.updateProduct(this.editingProduct.id, this.formModel as IProduct).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully', 'Success');
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          this.toastr.error('Failed to update product', 'Error');
        }
      });
    } else {
      this.adminService.createProduct(this.formModel as IProduct).subscribe({
        next: () => {
          this.toastr.success('Product created successfully', 'Success');
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          this.toastr.error('Failed to create product', 'Error');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully', 'Success');
          this.loadProducts();
        },
        error: (error) => {
          this.toastr.error('Failed to delete product', 'Error');
        }
      });
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src.indexOf('placeholder-product.svg') === -1) {
      imgElement.src = 'assets/images/placeholder-product.svg';
    }
  }
}
