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
    // Obtener la URL actual
    const currentRoute = this.router.url;
  
    // Dividir la URL en segmentos
    const segments = currentRoute.split('/');
  
    // Recuperar el último segmento
    const lastSegment = segments.pop() || ''; // Si el array está vacío, usa una cadena vacía
  
    // Comparar el último segmento con el argumento 'path'
    return lastSegment === path;
  }
  

}
