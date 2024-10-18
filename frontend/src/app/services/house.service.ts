import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private apiUrl: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getNumberHouseProducts(houseId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}/products/count`, { headers });
  }

  getNumberHouseUsers(houseId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}/users/count`, { headers });
  }

  getHouseProducts(houseId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}/products`, { headers });
  }

  getHouseUsers(houseId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}/users`, { headers });
  }

  getHouse(houseId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}`, { headers });
  }

  addMember(houseId: number, userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    const body = {
      user_id: userId
    };
    return this.http.post(`${this.apiUrl}/houses/${houseId}/addMember`, body, { headers });
  }
}
