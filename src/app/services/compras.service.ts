import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Compra {
  id: number;
  proveedor_id: number;
  fecha: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = 'http://localhost:3000/api/facturas-compra';

  constructor(private http: HttpClient) { }

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  crearCompra(compra: Partial<Compra>): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  actualizarCompra(id: number, compra: Partial<Compra>): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}/${id}`, compra);
  }

  eliminarCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
