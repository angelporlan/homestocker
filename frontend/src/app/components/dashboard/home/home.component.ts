import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { UserBoxComponent } from './user-box/user-box.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { ProductBoxComponent } from './product-box/product-box.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserBoxComponent, CommonModule, LoaderComponent, ProductBoxComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  houseProducts: any[] = [];
  houseUsers: any[] = [];
  houseDetails: any = {};
  numberOfProducts: number = 0;
  isLoading: boolean = true; 

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.isLoading = true; 

    this.dashboardService.getHouseProducts().subscribe({
      next: (products) => {
        this.houseProducts = products;

        this.houseProducts.forEach((product) => {
          this.numberOfProducts += product.total_quantity;
        });

        this.checkIfLoadingComplete();
      },
      error: (err) => {
        console.error('Error fetching house products', err);
        this.isLoading = false;
      }
    });

    this.dashboardService.getHouseUsers().subscribe({
      next: (users) => {
        this.houseUsers = users;
        console.log('houseUsers', this.houseUsers);
        this.checkIfLoadingComplete();
      },
      error: (err) => {
        console.error('Error fetching house users', err);
        this.isLoading = false;
      }
    });

    this.dashboardService.getHouseDetails().subscribe({
      next: (details) => {
        this.houseDetails = details;
        console.log('houseDetails', this.houseDetails);
        this.checkIfLoadingComplete();
      },
      error: (err) => {
        console.error('Error fetching house details', err);
        this.isLoading = false;
      }
    });

  }

  checkIfLoadingComplete(): void {
    if (this.houseUsers.length > 0 ) {
      this.isLoading = false;
    }
  }
}