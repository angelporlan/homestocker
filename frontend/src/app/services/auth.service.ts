import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string, username: string, image: string): Observable<any> {
    console.log(email, password, username, image);
    return this.http.post(`${this.apiUrl}/register`, { email, password, username, image });
  }

  userInfo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/users/profile`, { headers });
  }

  setUser(user: any): void {
    localStorage.setItem('currentUserHomeStocker', JSON.stringify(user));
  }
}
