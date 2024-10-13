import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { UserBoxComponent } from '../home/user-box/user-box.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserBoxComponent, CommonModule, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  houseUsers: any[] = [];
  isLoading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.isLoading = true; 

    this.dashboardService.getHouseUsers().subscribe({
      next: (users) => {
        this.houseUsers = users;
        if (this.houseUsers.length > 0) {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching house users', err);
        this.isLoading = false;
      }
    });
  }

}
