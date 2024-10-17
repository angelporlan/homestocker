import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  selectedOption: string = 'soon';
  selectedClass: string = 'soon';

  @Input() options: any = [];

  @Output() optionChange: EventEmitter<string> = new EventEmitter<string>();

  onSelectChange(): void {
    this.selectedClass = this.selectedOption;
    this.optionChange.emit(this.selectedOption);
  }
}
