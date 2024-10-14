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
}
