import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { DashboardService } from '../../../services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  product: any = {
    name: '',
    category: '',
    photo: '',
    quantities: [
      {
        quantity: 0,
        expiration_date: ''
      }
    ]
  };
  photoPreview: string | ArrayBuffer | null = null;
  inputFile: any;

  constructor(private productService: ProductService, private dashboardService: DashboardService, private snackBar: MatSnackBar) {}

  showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, 
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  close(): void {
    this.closeModal.emit(true);
  }

  addExpirationDetail(): void {
    this.product.quantities.push({
      quantity: 0,
      expiration_date: ''
    });
  }

  getHouseIdFromUrl(): number {
    const url = window.location.href;
    const houseId = url.split('/')[4];
    return parseInt(houseId, 10);
  }

  submitForm(): void {
    this.product.photo = this.photoPreview as string;
    this.formatDate();
    const houseId = this.getHouseIdFromUrl();
    this.productService.addProduct(houseId, this.product).subscribe((response: any) => {
      console.log('Product added', response);
      this.showMessage('Producto agregado correctamente');
      this.dashboardService.addProduct(response);
      this.close();
    } , (error: any) => {
      console.error('Error adding product', error);
      this.showMessage('Error al agregar el producto');
    });
  }

  //funcion para poner todas las fechas de product.quantities en formato d-m-Y
  formatDate(): void {
    this.product.quantities.forEach((quantity: any) => {
      const date = new Date(quantity.expiration_date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      quantity.expiration_date = `${day}-${month}-${year}`;
    });
  }

  removeExpirationDetail(index: number): void {
    this.product.quantities.splice(index, 1);
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result ?? null;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    fileInput.click();
  }


}
