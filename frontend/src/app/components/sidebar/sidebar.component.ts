import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currtentRoute: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateTo(path: string): void {
    let currentRoute = this.router.url;
    let segments = currentRoute.split('/');
    segments.pop();
    segments.push(path);
    const newRoute = segments.join('/');
    this.router.navigate([newRoute]);
  }
  
  isActive(path: string): boolean {
    const currentRoute = this.router.url;
    const segments = currentRoute.split('/');
    const lastSegment = segments.pop() || ''; 
    return lastSegment === path;
  }
  

}
