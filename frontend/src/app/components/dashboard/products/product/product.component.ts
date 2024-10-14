import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { LoaderComponent } from '../../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from "../products.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [LoaderComponent, CommonModule, ProductDetailComponent, ProductsComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  productId: string | null = null;
  product: any = null;
  localProduct: any = null;
  isLoading: boolean = true;

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
}
