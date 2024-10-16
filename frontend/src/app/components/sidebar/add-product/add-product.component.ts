import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    expiration_details: [
      {
        quantity: 0,
        expiration_date: ''
      }
    ]
  };
  photoPreview: string | ArrayBuffer | null = '../../../../assets/icons/image.svg';
  inputFile: any;

  constructor() {}

  close(): void {
    this.closeModal.emit(true);
  }

  addExpirationDetail(): void {
    this.product.expiration_details.push({
      quantity: 0,
      expiration_date: ''
    });
  }

  submitForm(): void {
    this.product.photo = this.photoPreview as string;
    console.log('Product submitted', this.product);
    this.close();
  }

  removeExpirationDetail(index: number): void {
    this.product.expiration_details.splice(index, 1);
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
