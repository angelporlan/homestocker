import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { UserBoxComponent } from '../home/user-box/user-box.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { SearchComponent } from '../../search/search.component';
import { FriendService } from '../../../services/friend.service';
import { HouseService } from '../../../services/house.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserBoxComponent, CommonModule, LoaderComponent, SearchComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  houseUsers: any[] = [];
  filteredUsers: any[] = [];
  availableUsers: any[] = [];
  isLoading: boolean = true;
  addUserModal: boolean = false;

  constructor(private dashboardService: DashboardService, private friendService: FriendService, private houseService: HouseService) {}

  ngOnInit(): void {
    this.isLoading = true; 

    this.dashboardService.getHouseUsers().subscribe({
      next: (users) => {
        this.houseUsers = users;
        this.filteredUsers = this.houseUsers;
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

  onSearch(searchTerm: string) {
    this.filteredUsers = this.houseUsers.filter((user) => {
      return user.username.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  addUser(user: any) {
    this.houseService.addMember(this.dashboardService.getHouseId(), user.id).subscribe({
      next: (res) => {
        this.houseUsers.push(user);
        this.filteredUsers = this.houseUsers;
        this.addUserModal = false;
      },
      error: (err) => {
        console.error('Error adding user', err);
      }
    });
  }

  modalAddUser() {
    this.isLoading = true;
    this.availableUsers = [];
    this.addUserModal = true;
    this.friendService.getFriends().subscribe({
      next: (friends: any) => {
        friends.forEach((friend: any) => {
          if (!this.houseUsers.find((user: any) => user.id === friend.id) && friend.isConfirmed) {
            this.availableUsers.push(friend);
          }
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching users', err);
        this.isLoading = false;
      }
    });

  }

}
