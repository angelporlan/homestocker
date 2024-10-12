import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HouseService } from '../../services/house.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { UserBoxComponent } from '../../components/dashboard/user-box/user-box.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, LoaderComponent, CommonModule, UserBoxComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  loading: boolean = true;
  houseProducts: any[] = [];
  houseUsers: any[] = [];
  houseDetails: any = {};
  numberOfProducts: number = 0;

  constructor(private houseService: HouseService, private authService: AuthService, private route: ActivatedRoute, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const houseId = this.route.snapshot.params['id'];
    const token = this.authService.getToken();
    forkJoin({
      houseProducts: this.houseService.getHouseProducts(houseId, token),
      houseUsers: this.houseService.getHouseUsers(houseId, token),
      houseDetails: this.houseService.getHouse(houseId, token),
    }).subscribe((response: any) => {
      this.houseProducts = response.houseProducts.products;
      this.houseUsers = response.houseUsers.users;
      this.houseDetails = response.houseDetails;
      
      // Calculate the number of products in the house
      this.houseProducts.forEach((product) => {
        product.expiration_details.forEach((element: { quantity: number; }) => {
            this.numberOfProducts += element.quantity;
        });
      })

      this.dashboardService.setHouseProducts(this.houseProducts);
      this.dashboardService.setHouseUsers(this.houseUsers);
      this.dashboardService.setHouseDetails(this.houseDetails);

      console.log('houseProducts', this.houseProducts);
      console.log('houseUsers', this.houseUsers);
      console.log('houseDetails', this.houseDetails);
      this.loading = false;
    })
  }
}
