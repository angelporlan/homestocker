import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HouseService } from '../../services/house.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, LoaderComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  loading: boolean = true;
  houseProducts: any[] = [];
  houseUsers: any[] = [];
  houseDetails: any = {};

  constructor(private houseService: HouseService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const houseId = this.route.snapshot.params['id'];
    const token = this.authService.getToken();
    forkJoin({
      houseProducts: this.houseService.getHouseProducts(houseId, token),
      houseUsers: this.houseService.getHouseUsers(houseId, token),
      houseDetails: this.houseService.getHouse(houseId, token)
    }).subscribe((response: any) => {
      this.houseProducts = response.houseProducts;
      this.houseUsers = response.houseUsers;
      this.houseDetails = response.houseDetails;
      console.log(this.houseProducts, this.houseUsers, this.houseDetails);
      this.loading = false;
    })
  }
}
