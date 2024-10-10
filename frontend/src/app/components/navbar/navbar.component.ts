import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  currentUser: any;
  userImage: string = '../../../assets/icons/user.svg';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUserHomeStocker');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.userImage = this.currentUser.image;
      console.log(user);
    } else {
      console.log(user);
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
