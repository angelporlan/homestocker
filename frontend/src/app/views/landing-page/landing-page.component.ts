import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { ImageLettersComponent } from '../../components/landing-page/image-letters/image-letters.component';
import { PreArticleComponent } from '../../components/landing-page/pre-article/pre-article.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, DashboardComponent, ImageLettersComponent, PreArticleComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
