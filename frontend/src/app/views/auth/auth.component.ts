import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'] 
})
export class AuthComponent {
  loginActive: boolean = true;
  email: any;
  password: any;
  username: any;
  image: string = '../../../assets/profile/profile1.jpg';
  submitText: string = 'Login';
  profileImage: any;
  showModal: boolean = false; 
  profileImages: string[] = [
    '../../../assets/profile/profile1.jpg',
    '../../../assets/profile/profile2.jpg',
    '../../../assets/profile/profile3.jpg'
  ];

  constructor(private router: Router) {}

  toggleAuth(value: boolean): void {
    this.loginActive = value;
    this.submitText = value ? 'Login' : 'Register';
  }

  login(): void {
    console.log(this.email);
  }
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  selectImage(image: string): void {
    this.profileImage = image;
    this.closeModal();
  }
}