import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private apiUrl: string = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient, private AuthService: AuthService) { }

  getFriends(): any {
    const headers = {
      'Authorization': `Bearer ${this.AuthService.getToken()}`
    }
    return this.http.get(`${this.apiUrl}/users/friends`, { headers });
  }
}
