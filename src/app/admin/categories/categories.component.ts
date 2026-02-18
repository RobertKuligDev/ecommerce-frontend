import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ICategory } from '../../shared/models/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  categories: ICategory[] = [];
  loading = false;
  showForm = false;
  editingCategory: ICategory | null = null;

  formModel: Partial<ICategory> = {
    name: '',
    description: ''
  };

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load categories', 'Error');
        this.loading = false;
      }
    });
  }

  openForm(category?: ICategory): void {
    if (category) {
      this.editingCategory = category;
      this.formModel = { ...category };
    } else {
      this.editingCategory = null;
      this.formModel = {
        name: '',
        description: ''
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCategory = null;
  }

  saveCategory(): void {
    if (!this.formModel.name) {
      this.toastr.error('Category name is required', 'Error');
      return;
    }

    if (this.editingCategory) {
      this.adminService.updateCategory(this.editingCategory.id, this.formModel as ICategory).subscribe({
        next: () => {
          this.toastr.success('Category updated successfully', 'Success');
          this.loadCategories();
          this.closeForm();
        },
        error: (error) => {
          this.toastr.error('Failed to update category', 'Error');
        }
      });
    } else {
      this.adminService.createCategory(this.formModel as ICategory).subscribe({
        next: () => {
          this.toastr.success('Category created successfully', 'Success');
          this.loadCategories();
          this.closeForm();
        },
        error: (error) => {
          this.toastr.error('Failed to create category', 'Error');
        }
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => {
          this.toastr.success('Category deleted successfully', 'Success');
          this.loadCategories();
        },
        error: (error) => {
          this.toastr.error('Failed to delete category', 'Error');
        }
      });
    }
  }
}
