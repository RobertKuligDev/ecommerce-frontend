import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrderService } from './order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  orders: IOrder[] = [];

  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  /**
   * Initializes the component and retrieves the list of user orders.
   */
  ngOnInit(): void {
    this.getOrders();
  }

  /**
   * Calls the order service to fetch user orders and handles the response.
   * On success, populates the orders array; on error, logs the error message.
   */
  getOrders() {
    this.orderService.getOrdersForUser().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders;
      },
      error: (err) => {
        this.toastr.error('Failed to load orders', 'Error');
      }
    });
  }

}

