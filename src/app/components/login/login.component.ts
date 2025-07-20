
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',                      // Nombre del selector para usar en HTML
  standalone: false,                          // No es componente independiente
  templateUrl: './login.component.html',     // Ruta del archivo de plantilla HTML
  styleUrls: ['./login.component.css']       // Ruta del archivo CSS para estilos
})
export class LoginComponent {
  email = '';     // Variable para guardar el correo ingresado por el usuario
  password = '';  // Variable para guardar la contraseña ingresada
  error = '';     // Variable para mostrar mensajes de error en la vista

  // Inyectamos HttpClient para hacer peticiones HTTP y Router para navegación
  constructor(private http: HttpClient, private router: Router) {}

  // Método que se ejecuta al enviar el formulario de login
  login() {
    // Mostrar en consola que se ha iniciado el proceso de login con los datos ingresados
    console.log('Método login llamado con:', this.email, this.password);

    // Limpiar cualquier mensaje de error previo antes de hacer la petición
    this.error = '';

    // Hacemos una petición POST al backend con el email y password ingresados
    this.http.post<any>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        // Ya no se guarda token ni se espera token
        console.log('Login exitoso:', res);
        // Redirigir al usuario a la página principal después del login
        this.router.navigate(['pages/home']);
      },
      error: (err) => {
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
