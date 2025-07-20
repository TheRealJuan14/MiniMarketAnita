import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  // Ahora el login solo valida si el usuario existe, no espera token
  login(usuario: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, usuario);
  }
}
