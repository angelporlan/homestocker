import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HouseBoxComponent } from '../../components/house-box/house-box.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homes',
  standalone: true,
  imports: [NavbarComponent, HouseBoxComponent, CommonModule],
  templateUrl: './houses.component.html',
  styleUrl: './houses.component.css'
})
export class HomesComponent {

  user: any;
  houses: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.houses = this.user.houses;
    console.log(this.houses);
  }

}
