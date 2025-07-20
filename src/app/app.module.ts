
import { NgModule } from '@angular/core';

// Importación principal para apps web Angular
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Para animaciones (Angular Material, etc)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Módulo de rutas
import { AppRoutingModule } from './app-routing.module';

// Componente raíz de la app
import { AppComponent } from './app.component';

// Para hacer peticiones HTTP
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

// Para formularios con ngModel y validaciones
import { FormsModule } from '@angular/forms';

// Manejo de rutas (RouterModule)
import { RouterModule } from '@angular/router';

// Interceptor funcional JWT (para enviar token en headers)
import { jwtInterceptorInterceptor } from './jwt-interceptor.interceptor';

// Angular Material módulos usados para UI
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// Componentes de la aplicación
import { HomeComponent } from './components/home/home.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ComprasComponent } from './components/compras/compras.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { PagesComponent } from './components/pages/pages.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// Otros módulos
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PagesComponent,
    CategoriasComponent,
    ClientesComponent,
    ComprasComponent,
    ProductosComponent,
    VentasComponent,
    ProveedoresComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,         // Módulo para peticiones HTTP (importante)
    FormsModule,              // Soporte para ngModel y formularios
    MatSidenavModule,         // Módulos Angular Material para UI
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    RouterModule,
    MenuModule
  ],
  providers: [
    // Proveedor para hidratación cliente-servidor (SSR, si usas)
    provideClientHydration(withEventReplay()),

    // Proveedor para el cliente HTTP con interceptores funcionales
    provideHttpClient(
      // Registra el interceptor funcional JWT para agregar token en headers
      withInterceptors([jwtInterceptorInterceptor])
    )
  ],
  bootstrap: [AppComponent]  // Componente raíz para bootstrap
})
export class AppModule { }
