import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.http.post<any>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        // Aquí puedes guardar el token si lo necesitas
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        if (err?.error?.msg) {
          this.error = err.error.msg;
        } else if (err?.message) {
          this.error = err.message;
        } else {
          this.error = 'Error al iniciar sesión';
        }
      }
    });
  }
}