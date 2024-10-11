import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-house-box',
  standalone: true,
  imports: [],
  templateUrl: './house-box.component.html',
  styleUrl: './house-box.component.css'
})
export class HouseBoxComponent {
  @Input() house: any;

  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
