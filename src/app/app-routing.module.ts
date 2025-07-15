import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,  // Aquí está tu navbar
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'ventas', component: VentasComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' } // Redirigir a home si solo es /pages
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },

  // Redirección general
  { path: '', redirectTo: '/pages/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/pages/home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
