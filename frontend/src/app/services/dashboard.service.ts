import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private houseProductsSubject = new BehaviorSubject<any[]>([]);
  private houseUsersSubject = new BehaviorSubject<any[]>([]);
  private houseDetailsSubject = new BehaviorSubject<any>({});

  setHouseProducts(products: any[]): void {
    this.houseProductsSubject.next(products);
  }

  getHouseProducts() {
    return this.houseProductsSubject.asObservable();
  }

  setHouseUsers(users: any[]): void {
    this.houseUsersSubject.next(users);
  }

  getHouseUsers() {
    return this.houseUsersSubject.asObservable();
  }

  setHouseDetails(details: any): void {
    this.houseDetailsSubject.next(details);
  }

  getHouseDetails() {
    return this.houseDetailsSubject.asObservable();
  }

}