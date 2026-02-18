import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProduct } from '../shared/models/product';
import { ICategory } from '../shared/models/category';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Products
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.baseUrl}Products/all`);
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}Products/${id}`);
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.baseUrl}Products`, product);
  }

  updateProduct(id: number, product: IProduct): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Products/${id}`);
  }

  // Categories
  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.baseUrl}Categories`);
  }

  getCategoryById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.baseUrl}Categories/${id}`);
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.baseUrl}Categories`, category);
  }

  updateCategory(id: number, category: ICategory): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Categories/${id}`);
  }

  // Orders
  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseUrl}Orders`);
  }

  getOrderById(id: number): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.baseUrl}Orders/${id}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Orders/${orderId}`, { status });
  }
}
