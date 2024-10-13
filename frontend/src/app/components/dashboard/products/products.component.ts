import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { LoaderComponent } from '../../loader/loader.component';
import { ProductBoxComponent } from '../home/product-box/product-box.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgClass, FormsModule, LoaderComponent, CommonModule, ProductBoxComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  selectedClass: string = '';
  selectedOption: string = 'soon';
  houseProducts: any[] = [];
  filteredProducts: any[] = [];
  numberOfProducts: number = 0;
  isLoading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.dashboardService.getHouseProducts().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (products) => {
        this.houseProducts = products;
        this.filteredProducts = this.houseProducts.slice().sort((a, b) => 
          this.getClosestExpirationDate(a).getTime() - this.getClosestExpirationDate(b).getTime()
        );
      },
      error: (err) => {
        console.error('Error fetching house products', err);
        this.isLoading = false;
      },
    });

    //comprobar si se completa la carga, cuando añada ngrx store lo cambiaré 
    this.dashboardService.getHouseDetails().subscribe({
      next: (details) => {
        if (details.name) {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching house details', err);
        this.isLoading = false;
      },
    });
  }

  getClosestExpirationDate(product: any): Date {
    if (!product.expiration_details || product.expiration_details.length === 0) {
      return new Date(0); 
    }

    const closestExpirationDetail = product.expiration_details.reduce(
      (closest: any, current: any) => {
        const closestDate = new Date(closest.expiration_date);
        const currentDate = new Date(current.expiration_date);
        return currentDate < closestDate ? current : closest;
      }
    );

    return new Date(closestExpirationDetail.expiration_date);
  }

  onSelectChange() {
    if (this.selectedOption === 'alphabetical') {
      this.selectedClass = 'alphabetical';
      this.filteredProducts = this.houseProducts.slice().sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedOption === 'last') {
      this.selectedClass = 'last';
      this.filteredProducts = this.houseProducts.slice().sort((a, b) => 
        this.getClosestExpirationDate(b).getTime() - this.getClosestExpirationDate(a).getTime()
      );
    } else {
      this.selectedClass = 'soon';
      this.filteredProducts = this.houseProducts.slice().sort((a, b) => 
        this.getClosestExpirationDate(a).getTime() - this.getClosestExpirationDate(b).getTime()
      );
    }
  }
}
