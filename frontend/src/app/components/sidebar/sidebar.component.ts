import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, AddProductComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currtentRoute: string = '';
  isAddProductActive: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  navigateTo(path: string): void {
    const currentRoute = this.router.url;
    const segments = currentRoute.split('/');
    const dashboardIndex = segments.indexOf('dashboard');
    const id = segments[dashboardIndex + 1];
    const newRoute = `dashboard/${id}/${path}`;
    this.router.navigate([newRoute]);
  }

  isActive(path: string): boolean {
    const currentRoute = this.router.url;
    const segments = currentRoute.split('/');
    return segments.includes(path);
  }
  

}
