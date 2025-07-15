import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  // Puedes agregar otros datos que te retorne el backend
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; // Cambia según tu ruta real

  constructor(private http: HttpClient) { }

  login(usuario: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, usuario);
  }

  // Puedes agregar más métodos aquí (logout, registro, etc)
}
