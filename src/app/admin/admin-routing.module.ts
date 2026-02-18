import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminOrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    data: { breadcrumb: 'Admin Dashboard' }
  },
  {
    path: 'products',
    component: AdminProductsComponent,
    canActivate: [adminGuard],
    data: { breadcrumb: 'Products Management' }
  },
  {
    path: 'categories',
    component: AdminCategoriesComponent,
    canActivate: [adminGuard],
    data: { breadcrumb: 'Categories Management' }
  },
  {
    path: 'orders',
    component: AdminOrdersComponent,
    canActivate: [adminGuard],
    data: { breadcrumb: 'Orders Management' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
