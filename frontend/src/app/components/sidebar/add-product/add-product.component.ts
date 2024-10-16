import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @Output() closeModal: boolean = false;
  showModal: boolean = false;
  product: any = {
    name: '',
    category: '',
    total_quantity: 0,
    photo: '',
    expiration_details: [
      {
        quantity: 0,
        expiration_date: ''
      }
    ]
  };

  constructor() {}

  close(): void {
    this.closeModal = true;
    //emitir el output closeModal

  }

  addExpirationDetail(): void {
    this.product.expiration_details.push({
      quantity: 0,
      expiration_date: ''
    });
  }

  submitForm(): void {
    console.log('Product submitted', this.product);
    this.close();
  }

}
