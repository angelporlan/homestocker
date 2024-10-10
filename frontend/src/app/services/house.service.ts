import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private apiUrl: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getNumberHouseProducts(houseId: number, token: string): Observable<any> {
    // bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}/products/count`, { headers });
  }

  getNumberHouseUsers(houseId: number, token: string): Observable<any> {
    // bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/houses/${houseId}/users/count`, { headers });
  }
}
