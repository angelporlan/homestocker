import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, DashboardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
