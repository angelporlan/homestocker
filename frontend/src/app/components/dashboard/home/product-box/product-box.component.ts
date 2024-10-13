import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-box',
  standalone: true,
  imports: [],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  @Input() product: any;

  getClosestExpirationDate(product: any): string | null {
    if (!product.expiration_details || product.expiration_details.length === 0) {
      return null; 
    }
  
    // Encontrar el detalle de caducidad más cercano
    const closestExpirationDetail = product.expiration_details.reduce(
      (closest: any, current: any) => {
        const closestDate = new Date(closest.expiration_date);
        const currentDate = new Date(current.expiration_date);        
  
        return currentDate < closestDate ? current : closest;
      }
    );
  
    const closestDate = new Date(closestExpirationDetail.expiration_date);
    const today = new Date();
    
    // Calcular la diferencia en milisegundos
    const diffTime = closestDate.getTime() - today.getTime();
    
    // Convertir la diferencia en días
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    // Si la fecha ya ha pasado, devolver los días que lleva caducado
    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} days ago`;
    }
  
    // Si la fecha aún no ha pasado, devolver los días que faltan
    return `${diffDays} days left until it expires`;
  }
  
  
}
