import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { LoaderComponent } from '../../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from "../products.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [LoaderComponent, CommonModule, ProductDetailComponent, ProductsComponent, FormsModule],
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

  constructor(private route: ActivatedRoute, private productService: ProductService, private dashboardService: DashboardService) { }

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
        this.isLoading = false;
      } else {
        if (id !== null) {            
          this.productService.getProductById(id).subscribe({
            next: (product: any) => {
              this.product = product;
              this.isLoading = false;
            },
            error: (err: any) => {
              console.error('Error fetching product', err);
            },
          });

        }
      }
    });
  }

  onEdit(): void {
    console.log('Edit product');
  }

  onDelete(): void {
    console.log('Delete product');
  }

  onAdd(): void {
    console.log('Back to products');
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
          console.log('Detail product added', JSON.stringify(response));
          this.showModal=false;
          this.onProductUpdated(response);
        },
        (error: any) => {
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
}
