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

  constructor(private router: Router) { }

  getClosestExpirationDate(product: any): string | null {
    const expirationDates: any[] = product.expiration_details;

    if (!expirationDates || expirationDates.length === 0) {
      return null;
    }

    function parseDate(dateString: string): Date {
      const [day, month, year] = dateString.split('-').map((part: string) => parseInt(part, 10));
      return new Date(year, month - 1, day);
    }

    const closestExpirationDetail = expirationDates.reduce((closest: any, current: any) => {
      const closestDate = parseDate(closest.expiration_date);
      const currentDate = parseDate(current.expiration_date);

      return currentDate < closestDate ? current : closest;
    });

    const closestDate = parseDate(closestExpirationDetail.expiration_date);

    const day = closestDate.getDate().toString().padStart(2, '0');
    const month = (closestDate.getMonth() + 1).toString().padStart(2, '0');
    const year = closestDate.getFullYear();

    return `${day}-${month}-${year}`;
  }

  getDaysUntilExpiration(product: any): string | null {
    const date = this.getClosestExpirationDate(product);
    if (!date) {
      return null;
    }
    const [day, month, year] = date.split('-').map((part: string) => parseInt(part, 10));
    const expirationDate = new Date(year, month - 1, day);
    const today = new Date();
    const diff = expirationDate.getTime() - today.getTime();
    const result =  Math.ceil(diff / (1000 *60 *60 *24));
    
    if (result < 0) {
      return `Expired ${Math.abs(result)} days ago`;
    }

    if (result === 0) {
      return 'Expires today';
    }

    return `${result} days until expiration`;

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
