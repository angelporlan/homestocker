import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  currentUser: any;

  ngOnInit(): void {
    const user = true;
    if (user) {
      this.currentUser =true;
      console.log(user);
    } else {
      console.log(user);
    }
  }
}
