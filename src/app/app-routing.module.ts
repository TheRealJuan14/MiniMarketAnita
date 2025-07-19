import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importación de todos los componentes que usaremos en las rutas
import { HomeComponent } from './components/home/home.component';
import { PagesComponent } from './components/pages/pages.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ComprasComponent } from './components/compras/compras.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { LoginComponent } from './components/login/login.component'; 
import { RegisterComponent } from './components/register/register.component';

// Definimos las rutas principales
const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent, // Este es el contenedor con navbar/sidebar
    children: [
      { path: 'home', component: HomeComponent },              // Ruta: /pages/home
      { path: 'categorias', component: CategoriasComponent },  // Ruta: /pages/categorias
      { path: 'clientes', component: ClientesComponent },      // Ruta: /pages/clientes
      { path: 'compras', component: ComprasComponent },        // Ruta: /pages/compras
      { path: 'productos', component: ProductosComponent },    // Ruta: /pages/productos
      { path: 'proveedores', component: ProveedoresComponent },// Ruta: /pages/proveedores
      { path: 'ventas', component: VentasComponent },          // Ruta: /pages/ventas

      // Si acceden a /pages sin nada más, redirige a home
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Rutas fuera de la sección "pages"
  { path: 'login', component: LoginComponent },       // Ruta de login
  { path: 'registro', component: RegisterComponent }, // Ruta de registro

  // Redirección por defecto al login (cuando la URL está vacía)
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Si la ruta no existe, redirige también al login
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
