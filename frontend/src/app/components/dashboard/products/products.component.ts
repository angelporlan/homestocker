import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  selectedClass: string = '';
  selectedOption: string = 'soon';

  onSelectChange() {
    if (this.selectedOption === 'alphabetical') {
      console.log('alphabetical');
      this.selectedClass = 'alphabetical';
    } else if (this.selectedOption === 'last') {
      this.selectedClass = 'last';
    } else {
      this.selectedClass = 'soon';
    }
  }
}
