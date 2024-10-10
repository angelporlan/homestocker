import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, LoaderComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'] 
})
export class AuthComponent {
  isLoading: boolean = false;
  loginActive: boolean = true;
  email: any;
  password: any;
  username: any;
  image: string = '../../../assets/profile/profile1.jpg';
  submitText: string = 'Login';
  profileImage: string = '../../../assets/profile/profile1.jpg';
  showModal: boolean = false; 
  profileImages: string[] = [
    '../../../assets/profile/profile1.jpg',
    '../../../assets/profile/profile2.jpg',
    '../../../assets/profile/profile3.jpg'
  ];

  constructor(private router: Router, 
              private authService: AuthService,
              private snackBar: MatSnackBar
  ) {}

  showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, 
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  toggleAuth(value: boolean): void {
    this.loginActive = value;
    this.submitText = value ? 'Login' : 'Register';
  }

  login(): void {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe(
      (res: any) => {
        if (res.token) {
          console.log('Login successful: ');
          this.authService.setToken(res.token);
          this.authService.userInfo(res.token).subscribe((user: any) => {
            console.log('User info: ', user);
            this.authService.setUser(user);
            this.navigateTo('/');
          });
        } else {
          this.isLoading = false;
          this.showMessage('Error durante el inicio de sesión. Inténtalo de nuevo.');
        }
      },
      (error: any) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.showMessage('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
          } else {
            this.showMessage('Error durante el inicio de sesión. Inténtalo de nuevo.');
          }
      }
    );
  }

  register(): void {
    this.isLoading = true;
    this.authService.register(this.email, this.password, this.username, this.profileImage).subscribe(
      (res: any) => {
        if (res.id) {
          this.isLoading = false;
          console.log('Register successful: ');
          this.loginActive = true;
          this.submitText = 'Login';
          this.showMessage('Registro exitoso. Por favor, inicia sesión.');
        } else {
          this.showMessage('Error durante el registro. Inténtalo de nuevo.');
        }
      },
      (error: any) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.showMessage('El email ya está registrado. Por favor, intenta con otro.');
        } else {
          this.showMessage('Error durante el registro. Inténtalo de nuevo.');
        }
      });
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