import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchComponent } from '../../components/search/search.component';
import { FriendService } from '../../services/friend.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../../components/dashboard/users/users.component';
import { UserBoxComponent } from "../../components/dashboard/home/user-box/user-box.component";
import { AuthService } from '../../services/auth.service';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [NavbarComponent, SearchComponent, LoaderComponent, CommonModule, UsersComponent, UserBoxComponent, FilterComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {

  isLoading: boolean = true;
  friends: any[] = [];
  pendingFriends: any[] = [];
  requestedFriends: any[] = [];
  currentUsers: any[] = [];
  selectOptions: string = 'friends';
  searchTerm: string = '';

  options = [
    { value: 'friends', label: 'Friends' },
    { value: 'pending', label: 'Pending' },
    { value: 'requested', label: 'Requested' }
  ]

  constructor(private friendsService: FriendService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.friends = [];
    this.pendingFriends = [];
    this.requestedFriends = [];
    this.currentUsers = [];
    this.selectOptions = 'friends';
    this.searchTerm = '';

    this.friendsService.getFriends().subscribe(
      (response: any) => {

        for (let friend of response) {
          if (friend.isConfirmed) {
            this.friends.push(friend);
            this.currentUsers.push(friend);
          } else if (friend.idCreatorFriendhip === this.authService.getIdUser()) {
            this.requestedFriends.push(friend);
          } else {
            this.pendingFriends.push(friend);
          }
        }

        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    );

  }

  filterUsers(): void {
    if (this.selectOptions === 'friends') {
      this.currentUsers = this.friends;
    } else if (this.selectOptions === 'pending') {
      this.currentUsers = this.pendingFriends;
    } else {
      this.currentUsers = this.requestedFriends;
    }
    if (this.searchTerm) {
      this.currentUsers = this.currentUsers.filter(user => user.username.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
  }

  onSearchChange(event: string): void {
    this.searchTerm = event;
    this.filterUsers();
  }

  onFilterChange(event: any): void {
    this.selectOptions = event;
    this.filterUsers();
  }
}
