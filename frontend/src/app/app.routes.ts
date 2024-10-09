import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { AuthComponent } from './views/auth/auth.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'login', component: AuthComponent}
];
