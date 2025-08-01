import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css',
  standalone: false
})
export class PagesComponent {
  // Inyecta el Router para navegación
  constructor(private router: Router) {}

  // Menú de perfil para configuración y cerrar sesión
  perfilMenu = [
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => {
        // Aquí podrías navegar a configuración del perfil
        console.log('Ir a configuración');
      }
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Métodos para navegar a las rutas correspondientes
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
    this.router.navigate(['/pages/categorias']);
  }

  irAClientes() {
    this.router.navigate(['/pages/clientes']);
  }

  irACompras() {
    this.router.navigate(['/pages/compras']);
  }

  irAProductos() {
    this.router.navigate(['/pages/productos']);
  }

  irAProveedores() {
    this.router.navigate(['/pages/proveedores']);
  }

  irAVentas() {
    this.router.navigate(['/pages/ventas']);
  }
}
