import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchOption: string = '';
  
  @Input() placeholder: string = '';
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchOption = input.value;
    this.searchChange.emit(this.searchOption);
  }

}
