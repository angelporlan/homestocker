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
  @Input() options: any = [];

  selectedOption: string = '';
  selectedClass: string = '';

  @Output() optionChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.options.length > 0) {
      this.selectedOption = this.options[0].value;
      this.selectedClass = this.options[0].value;
    }
  }

  onSelectChange(): void {
    this.selectedClass = this.selectedOption;
    this.optionChange.emit(this.selectedOption);
  }
}
