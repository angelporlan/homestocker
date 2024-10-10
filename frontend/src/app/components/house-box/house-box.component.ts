import { Component, Input } from '@angular/core';
import { HouseService } from '../../services/house.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-house-box',
  standalone: true,
  imports: [],
  templateUrl: './house-box.component.html',
  styleUrl: './house-box.component.css'
})
export class HouseBoxComponent {
  @Input() house: any;
  usersNumber: number = 0;
  productsNumber: number = 0;

  constructor(private houseService: HouseService, private authService: AuthService) {}

  ngOnInit(): void {
    forkJoin({
      usersNumber: this.houseService.getNumberHouseUsers(this.house.id, this.authService.getToken()),
      productsNumber: this.houseService.getNumberHouseProducts(this.house.id, this.authService.getToken())
    }).subscribe(({ usersNumber, productsNumber }) => {
      this.usersNumber = usersNumber;
      this.productsNumber = productsNumber;
    });
  }

}
