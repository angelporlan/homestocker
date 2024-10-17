import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchComponent } from '../../components/search/search.component';
import { FriendService } from '../../services/friend.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../../components/dashboard/users/users.component';
import { UserBoxComponent } from "../../components/dashboard/home/user-box/user-box.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [NavbarComponent, SearchComponent, LoaderComponent, CommonModule, UsersComponent, UserBoxComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {

  isLoading: boolean = true;
  friends: any[] = [];
  pendingFriends: any[] = [];
  requestedFriends: any[] = [];

  constructor(private friendsService: FriendService, private authService: AuthService) { }

  ngOnInit(): void {

    this.friendsService.getFriends().subscribe(
      (response: any) => {

        for (let friend of response) {
          if (friend.isConfirmed) {
            this.friends.push(friend);
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

  onSearchChange(event: string): void {
    console.log('Search change', event);
  }
}
