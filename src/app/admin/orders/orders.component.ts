import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { IOrder } from '../../shared/models/order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: IOrder[] = [];
  loading = false;
  selectedOrder: IOrder | null = null;
  showDetails = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load orders', 'Error');
        this.loading = false;
      }
    });
  }

  viewOrder(order: IOrder): void {
    this.selectedOrder = order;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastr.success('Order status updated', 'Success');
        this.loadOrders();
        this.closeDetails();
      },
      error: (error) => {
        this.toastr.error('Failed to update order status', 'Error');
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
