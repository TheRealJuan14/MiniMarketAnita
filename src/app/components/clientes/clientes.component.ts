import { Component } from '@angular/core';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
}

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '12345678', telefono: '987654321', direccion: 'Av. Lima 123' },
    { id: 2, nombre: 'María', apellido: 'Gómez', dni: '87654321', telefono: '987123456', direccion: 'Jr. Ayacucho 456' }
  ];

  nuevoCliente: Cliente = {
    id: 0,
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: ''
  };

  agregarCliente() {
    if (this.nuevoCliente.nombre.trim() === '' || this.nuevoCliente.apellido.trim() === '' || this.nuevoCliente.dni.trim() === '') return;
    
    this.nuevoCliente.id = this.clientes.length > 0 
      ? Math.max(...this.clientes.map(c => c.id)) + 1 
      : 1;
    
    this.clientes.push({...this.nuevoCliente});
    this.nuevoCliente = { id: 0, nombre: '', apellido: '', dni: '', telefono: '', direccion: '' };
  }

  editarCliente(cliente: Cliente) {
    this.nuevoCliente = {...cliente};
  }

  eliminarCliente(id: number) {
    this.clientes = this.clientes.filter(c => c.id !== id);
  }

  verDetalles(cliente: Cliente) {
    alert(`Detalles del cliente:\nNombre: ${cliente.nombre} ${cliente.apellido}\nDNI: ${cliente.dni}\nTeléfono: ${cliente.telefono}\nDirección: ${cliente.direccion}`);
  }
}