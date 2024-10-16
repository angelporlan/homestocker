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

  updateProductById(productId: number, product: any) {
    const products = this.houseProductsSubject.getValue();
    const index = products.findIndex((p: any) => p.id === productId);
    products[index] = product;
    this.setHouseProducts(products);
  }

  deleteProductById(productId: number) {
    const products = this.houseProductsSubject.getValue();
    const index = products.findIndex((p: any) => p.id === productId);
    products.splice(index, 1);
    this.setHouseProducts(products);
  }

  addProduct(product: any) {
    const products = this.houseProductsSubject.getValue();
    products.push(product);
    this.setHouseProducts(products);
  }

}