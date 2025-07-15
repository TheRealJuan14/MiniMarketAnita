import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'Market';

  constructor(public router: Router) {}

  irARegistro() { this.router.navigate(['/register']); }
  irALogin() { this.router.navigate(['/login']); }
  irAHome() { this.router.navigate(['/home']); }
  irAPages() { this.router.navigate(['/pages']); }
  irACategorias() { this.router.navigate(['/pages/categorias']); }
  irAClientes() { this.router.navigate(['/pages/clientes']); }
  irACompras() { this.router.navigate(['/pages/compras']); }
  irAProductos() { this.router.navigate(['/pages/productos']); }
  irAProveedores() { this.router.navigate(['/pages/proveedores']); }
  irAVentas() { this.router.navigate(['/pages/ventas']); }
}
