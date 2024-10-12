import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { AuthComponent } from './views/auth/auth.component';
import { HomesComponent } from './views/houses/houses.component';
import { HomeComponent } from './components/dashboard/home/home.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent},
    { path: 'login', component: AuthComponent},
    { path: 'houses', component: HomesComponent},
    { path: 'dashboard/:id', component: DashboardComponent, children: [
        { path: 'home', component: HomeComponent },
    ]},

];
