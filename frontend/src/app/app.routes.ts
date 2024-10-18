import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { AuthComponent } from './views/auth/auth.component';
import { HomesComponent } from './views/houses/houses.component';
import { FriendsComponent } from './views/friends/friends.component';

// dashboard components
import { HomeComponent } from './components/dashboard/home/home.component';
import { ProductsComponent } from './components/dashboard/products/products.component';
import { UsersComponent } from './components/dashboard/users/users.component';
import { NotificationsComponent } from './components/dashboard/notifications/notifications.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { ProductComponent } from './components/dashboard/products/product/product.component';
import { ShoppingListComponent } from './components/dashboard/shopping-list/shopping-list.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent},
    { path: 'login', component: AuthComponent},
    { path: 'houses', component: HomesComponent},
    { path: 'friends', component: FriendsComponent},
    { path: 'dashboard/:id', component: DashboardComponent, children: [
        { path: 'home', component: HomeComponent },
        { path: 'products', component: ProductsComponent},
        { path: 'product/:id', component: ProductComponent}, 
        { path: 'users', component: UsersComponent},
        { path: 'shopping-list', component: ShoppingListComponent},
        { path: 'notifications', component: NotificationsComponent},
        { path: 'settings', component: SettingsComponent}, 
    ]},

];
