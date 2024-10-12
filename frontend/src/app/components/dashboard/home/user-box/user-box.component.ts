import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-box',
  standalone: true,
  imports: [],
  templateUrl: './user-box.component.html',
  styleUrl: './user-box.component.css'
})
export class UserBoxComponent {
@Input() user: any;

}
