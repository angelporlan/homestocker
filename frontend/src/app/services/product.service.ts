import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProductById(productId: number): any {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/products/${productId}`, { headers });
  }

  addDetailProduct(productId: number, quantity: number, expiration_date: string): any {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      quantity,
      expiration_date
    };
    return this.http.post(`${this.apiUrl}/products/${productId}/details`, body ,{ headers });
  }

  removeDetailProduct(productId: number, quantity: number, expiration_date: string): any {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      quantity,
      expiration_date
    };
    return this.http.post(`${this.apiUrl}/products/${productId}/details/remove`, body ,{ headers });
  }
}
