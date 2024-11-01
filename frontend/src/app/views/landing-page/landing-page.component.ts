import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { ImageLettersComponent } from '../../components/landing-page/image-letters/image-letters.component';
import { PreArticleComponent } from '../../components/landing-page/pre-article/pre-article.component';
import { ArticlesComponent } from '../../components/landing-page/articles/articles.component';
import { EmailComponent } from '../../components/landing-page/email/email.component';
import { FooterComponent } from '../../components/landing-page/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, DashboardComponent, ImageLettersComponent, PreArticleComponent, ArticlesComponent, EmailComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
