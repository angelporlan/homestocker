import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-box',
  standalone: true,
  imports: [],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  @Input() product: any;

  constructor(private router: Router) {}

  getClosestExpirationDate(product: any): string | null {
    if (!product.expiration_details || product.expiration_details.length === 0) {
      return null; 
    }
  
    const closestExpirationDetail = product.expiration_details.reduce(
      (closest: any, current: any) => {
        const closestDate = new Date(closest.expiration_date);
        const currentDate = new Date(current.expiration_date);        
  
        return currentDate < closestDate ? current : closest;
      }
    );
  
    const closestDate = new Date(closestExpirationDetail.expiration_date);
    const today = new Date();
    
    const diffTime = closestDate.getTime() - today.getTime();
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} days ago`;
    }
  
    return `${diffDays} days left until it expires`;
  }
  
  navigateTo(path: string): void {
    let currentRoute = this.router.url;
    let segments = currentRoute.split('/');
    segments.pop();
    segments.push(path);
    const newRoute = segments.join('/');
    console.log('New route', newRoute);
    this.router.navigate([newRoute]);
  }
  
}
