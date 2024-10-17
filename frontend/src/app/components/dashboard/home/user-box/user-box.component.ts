import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FriendService } from '../../../../services/friend.service';

@Component({
  selector: 'app-user-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-box.component.html',
  styleUrl: './user-box.component.css'
})
export class UserBoxComponent {

  @Input() user: any;
  @Output() userChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private authService: AuthService, private friendService: FriendService) { }

  getId(): string {
    return this.authService.getIdUser();
  }

  rejectFriendship(idCreatorFriendhip: number) {
    this.friendService.rejectOrDeleteFriendRequest(idCreatorFriendhip).subscribe(
      (response: any) => {
        console.log(response);
        this.userChange.emit();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  acceptFriendship(idCreatorFriendhip: number) {
    this.friendService.sendOrAcceptFriendRequest(idCreatorFriendhip).subscribe(
      (response: any) => {
        console.log(response);
        this.userChange.emit();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
