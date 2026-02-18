import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { IProduct } from '../../shared/models/product';
import { ICategory } from '../../shared/models/category';
import { IOrder } from '../../shared/models/order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  totalProducts = 0;
  totalCategories = 0;
  totalOrders = 0;
  recentOrders: IOrder[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load products count
    this.adminService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });

    // Load categories count
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories.length;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Load orders
    this.adminService.getOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.recentOrders = orders.slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }
}
