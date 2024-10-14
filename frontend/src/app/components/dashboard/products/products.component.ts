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
  searchOption: string = '';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.dashboardService.getHouseProducts().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (products) => {
        this.houseProducts = products;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching house products', err);
        this.isLoading = false;
      },
    });

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

    const parseDate = (dateString: string): Date => {
      const [day, month, year] = dateString.split('-').map((part: string) => parseInt(part, 10));
      return new Date(year, month - 1, day);
    };

    const closestExpirationDetail = product.expiration_details.reduce(
      (closest: any, current: any) => {
        const closestDate = parseDate(closest.expiration_date);
        const currentDate = parseDate(current.expiration_date);
        return currentDate < closestDate ? current : closest;
      }
    );

    return parseDate(closestExpirationDetail.expiration_date);
  }


  applyFilters() {
    let filtered = this.houseProducts.filter((product) =>
      product.name.toLowerCase().includes(this.searchOption.toLowerCase())
    );

    if (this.selectedOption === 'alphabetical') {
      this.selectedClass = 'alphabetical';
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedOption === 'last') {
      this.selectedClass = 'last';
      filtered = filtered.sort((a, b) =>
        this.getClosestExpirationDate(b).getTime() - this.getClosestExpirationDate(a).getTime()
      );
    } else {
      this.selectedClass = 'soon';
      filtered = filtered.sort((a, b) =>
        this.getClosestExpirationDate(a).getTime() - this.getClosestExpirationDate(b).getTime()
      );
    }

    this.filteredProducts = filtered;
  }

  onSelectChange() {
    this.applyFilters();
  }

  onSearchChange(event: Event) {
    this.searchOption = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }
}
