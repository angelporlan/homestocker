import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { LoaderComponent } from '../../loader/loader.component';
import { ProductBoxComponent } from '../home/product-box/product-box.component';

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
          this.isLoading = false
        }
      },
      error: (err) => {
        console.error('Error fetching house details', err);
        this.isLoading = false;
      },});
  }

  onSelectChange() {
    if (this.selectedOption === 'alphabetical') {
      console.log('alphabetical');
      this.selectedClass = 'alphabetical';
    } else if (this.selectedOption === 'last') {
      this.selectedClass = 'last';
    } else {
      this.selectedClass = 'soon';
    }
  }
}
