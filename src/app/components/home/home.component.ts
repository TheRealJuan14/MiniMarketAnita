import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // ← corregido "styleUrl" → "styleUrls"
})
export class HomeComponent {
  // Inyectamos el servicio de rutas para navegar entre páginas
  constructor(private router: Router) {}

  // Métodos para redireccionar a distintas rutas
  irALogin() {
    this.router.navigate(['/login']);
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  irAPages() {
    this.router.navigate(['/pages']);
  }

  irACategorias() {
    this.router.navigate(['/categorias']);
  }

  irAClientes() {
    this.router.navigate(['/clientes']);
  }

  irACompras() {
    this.router.navigate(['/compras']);
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }

  irAProveedores() {
    this.router.navigate(['/proveedores']);
  }

  irAVentas() {
    this.router.navigate(['/ventas']);
  }
}
