import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { LoaderComponent } from '../../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from "../products.component";
import { FormsModule } from '@angular/forms';
import { FilterComponent } from '../../../filter/filter.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [LoaderComponent, CommonModule, ProductDetailComponent, ProductsComponent, FormsModule, FilterComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  productId: string | null = null;
  product: any = null;
  localProduct: any = null;
  isLoading: boolean = true;
  showModal: boolean = false;
  newQuantity: number = 0;
  newExpirationDate: string = '';
  showDeleteModal: boolean = false;

  selectedClass: string = '';
  selectedOption: string = 'soon';

  options = [
    { value: 'soon', label: 'Expired soon' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'last', label: 'Expired last' },
  ];

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private dashboardService: DashboardService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      const id = this.productId ? parseInt(this.productId, 10) : null;

      this.dashboardService.getHouseProducts().subscribe({
        next: (products) => {
          this.localProduct = products.find((product: any) => product.id === id);
        },
        error: (err) => {
          console.error('Error fetching house products', err);
        },
      });

      if (this.localProduct) {
        this.product = this.localProduct;
        this.product.expiration_details = this.sortDatesAsc(this.product.expiration_details);
        this.isLoading = false;
      } else {
        if (id !== null) {
          this.productService.getProductById(id).subscribe({
            next: (product: any) => {
              this.product = product;
              this.isLoading = false;
              this.product.expiration_details = this.sortDatesAsc(this.product.expiration_details);
            },
            error: (err: any) => {
              console.error('Error fetching product', err);
            },
          });

        }
      }
    });
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  onEdit(): void {
    console.log('Edit product');
  }

  onDeleteProduct(): void {
    this.productService.deleteProduct(this.product.id).subscribe(
      () => {
        this.dashboardService.deleteProductById(this.product.id);

        const currentRoute = this.router.url;

        const segments = currentRoute.split('/');
        const houseId = segments[2];

        const newRoute = `/dashboard/${houseId}/products`;

        this.router.navigate([newRoute]);
      },
      (error: any) => {
        console.error('Error deleting product', error);
      }
    );

  }

  onProductUpdated(updatedProduct: any): void {
    this.dashboardService.updateProductById(updatedProduct.id, updatedProduct);

    this.dashboardService.getHouseProducts().subscribe({
      next: (products) => {
        this.product = products.find((product: any) => product.id === updatedProduct.id);
      },
      error: (err) => {
        console.error('Error fetching house products', err);
      },
    });
  }

  submitForm(): void {
    if (this.product.id) {
      const formattedDate = this.formatDate(this.newExpirationDate);
      this.productService.addDetailProduct(this.product.id, this.newQuantity, formattedDate).subscribe(
        (response: any) => {
          this.showModal = false;
          this.onProductUpdated(response);
          this.showMessage('Product added successfully');
          this.newExpirationDate = '';
          this.newQuantity = 0;
        },
        (error: any) => {
          this.showMessage('Error adding detail product');
          console.error('Error adding detail product', error);
        }
      );
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  sortDatesDesc(expiration_details: any[]): any[] {
    return expiration_details.sort((a, b) => {
      const dateA = new Date(this.formatDateForSort(a.expiration_date)).getTime();
      const dateB = new Date(this.formatDateForSort(b.expiration_date)).getTime();
      return dateB - dateA;
    });
  }

  sortDatesAsc(expiration_details: any[]): any[] {
    return expiration_details.sort((a, b) => {
      const dateA = new Date(this.formatDateForSort(a.expiration_date)).getTime();
      const dateB = new Date(this.formatDateForSort(b.expiration_date)).getTime();
      return dateA - dateB;
    });
  }

  formatDateForSort(dateString: string): string {
    const parts = dateString.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  applyFilters(): void {
    if (this.selectedOption === 'soon') {
      this.product.expiration_details = this.sortDatesAsc(this.product.expiration_details);
      this.selectedClass = 'soon';
    } else if (this.selectedOption === 'last') {
      this.product.expiration_details = this.sortDatesDesc(this.product.expiration_details);
      this.selectedClass = 'last';
    } else if (this.selectedOption === 'quantity') {
      this.product.expiration_details = this.product.expiration_details.sort((a: any, b: any) => b.quantity - a.quantity);
      this.selectedClass = 'quantity';
    }
  }

  onFilterChange(selectdOption: any): void {
    this.selectedOption = selectdOption;
    this.applyFilters();
  }

  // desarrollo, en produccion borrar
  getProductImageUrl(): string {
    const backendUrl = 'http://localhost:8000'; // URL del backend
    return this.product.photo ? `${backendUrl}${this.product.photo}` : '../../../../../assets/images/product1.jpg';
  }
}
