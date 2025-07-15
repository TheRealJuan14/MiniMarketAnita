import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Definimos la interfaz que representa un proveedor
interface Proveedor {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-proveedores',
  standalone: false, // Este componente no es standalone (forma clásica)
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent {
  // Lista de proveedores de ejemplo
  proveedores: Proveedor[] = [
    {
      id: 1,
      nombre: 'Distribuidora ABC',
      ruc: '20123456789',
      direccion: 'Av. Industrial 123',
      telefono: '987654321',
      email: 'contacto@abc.com'
    },
    {
      id: 2,
      nombre: 'Mayorista XYZ',
      ruc: '20234567890',
      direccion: 'Jr. Comercio 456',
      telefono: '987123456',
      email: 'ventas@xyz.com'
    }
  ];

  // Objeto para registrar o editar un proveedor
  nuevoProveedor: Proveedor = {
    id: 0,
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: ''
  };

  // Agrega un proveedor nuevo si tiene nombre y RUC válidos
  agregarProveedor(): void {
    if (this.nuevoProveedor.nombre.trim() === '' || this.nuevoProveedor.ruc.trim() === '') return;

    // Genera un nuevo ID único
    this.nuevoProveedor.id = this.proveedores.length > 0
      ? Math.max(...this.proveedores.map(p => p.id)) + 1
      : 1;

    // Agrega el proveedor a la lista
    this.proveedores.push({ ...this.nuevoProveedor });

    // Limpia el formulario
    this.nuevoProveedor = { id: 0, nombre: '', ruc: '', direccion: '', telefono: '', email: '' };
  }

  // Carga los datos del proveedor al formulario para editar
  editarProveedor(proveedor: Proveedor): void {
    this.nuevoProveedor = { ...proveedor };
  }

  // Elimina un proveedor de la lista
  eliminarProveedor(id: number): void {
    this.proveedores = this.proveedores.filter(p => p.id !== id);
  }

  // Muestra los detalles de un proveedor en una alerta
  verDetalles(proveedor: Proveedor): void {
    alert(
      `Detalles del proveedor:\n` +
      `Nombre: ${proveedor.nombre}\n` +
      `RUC: ${proveedor.ruc}\n` +
      `Dirección: ${proveedor.direccion}\n` +
      `Teléfono: ${proveedor.telefono}\n` +
      `Email: ${proveedor.email}`
    );
  }
}
