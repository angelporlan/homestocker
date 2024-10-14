import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from '../../../../../services/product.service';
import { DashboardService } from '../../../../../services/dashboard.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() productDetail: any;
  @Input() productId: number | undefined;
  @Output() productDetailChange = new EventEmitter<any>();

  constructor(private productService: ProductService, private dashboardService: DashboardService) { }

  formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'Invalid date';
    }
  
    let normalizedDate = date;
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [day, month, year] = date.split('-');
      normalizedDate = `${year}-${month}-${day}`; 
    }
  
    const dateObj = new Date(normalizedDate);
    if (isNaN(dateObj.getTime())) {
      return date;
    }
  
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = this.getMonthName(dateObj.getMonth() + 1); 
    const year = dateObj.getFullYear();
  
    return `${month} ${day}, ${year}`;
  }
  
  getMonthName(month: number): string {
    switch (month) {
      case 1:
        return 'Jan';
      case 2:
        return 'Feb';
      case 3:
        return 'Mar';
      case 4:
        return 'Apr';
      case 5:
        return 'May';
      case 6:
        return 'Jun';
      case 7:
        return 'Jul';
      case 8:
        return 'Aug';
      case 9:
        return 'Sep';
      case 10:
        return 'Oct';
      case 11:
        return 'Nov';
      case 12:
        return 'Dec';
      default:
        return 'Invalid month';
    }
  }

  addOneQuantity(): void {
    if (this.productId !== undefined) {
      this.productService.addDetailProduct(this.productId, 1, this.productDetail.expiration_date).subscribe(
        (response: any) => {
            this.productDetailChange.emit(response);
        },
        (error: any) => {
          console.error('error: ' + JSON.stringify(error));
        }
      );
    } else {
      console.error('Product ID is undefined');
    }
  }

  quitOneQuantity(): void {
    if (this.productId !== undefined) {
      this.productService.removeDetailProduct(this.productId, 1, this.productDetail.expiration_date).subscribe(
        (response: any) => {
            this.productDetailChange.emit(response);
        },
        (error: any) => {
          console.error('error: ' + JSON.stringify(error));
        }
      );
    } else {
      console.error('Product ID is undefined');
    }
  }

}
