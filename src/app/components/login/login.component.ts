// Importamos lo necesario desde Angular
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',                         // Selector del componente para usar en HTML
  standalone: false,                             // No es un componente independiente
  templateUrl: './login.component.html',         // Ruta del archivo HTML
  styleUrls: ['./login.component.css']           // Ruta del archivo de estilos
})
export class LoginComponent {
  email = '';              // Variable para guardar el correo del usuario
  password = '';           // Variable para guardar la contraseña
  error = '';              // Variable para mostrar mensajes de error

  // Inyectamos HttpClient para hacer peticiones y Router para redireccionar
  constructor(private http: HttpClient, private router: Router) {}

  // Función que se ejecuta al enviar el formulario de login
  login() {
    this.error = ''; // Limpiar cualquier error anterior

    // Enviamos una petición POST al backend con email y password
    this.http.post<{ token: string }>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        // Si login fue exitoso, guardamos el token en localStorage
        localStorage.setItem('token', res.token);

        // Redireccionamos al usuario al home u otra ruta protegida
        this.router.navigate(['pages/home']);
      },
      error: (err) => {
        // Mostrar mensaje de error según el tipo de error recibido del backend
        console.error('Error en login:', err);

        if (err.status === 401) {
          this.error = 'Contraseña incorrecta';
        } else if (err.status === 404) {
          this.error = 'Usuario no encontrado';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al iniciar sesión. Intenta nuevamente.';
        }
      }
    });
  }
}
