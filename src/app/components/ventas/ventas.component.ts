import { Component } from '@angular/core';

// Interfaces para organizar los datos de ventas
interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

interface Venta {
  id: number;
  fecha: Date;
  clienteId: number;
  detalle: DetalleVenta[];
  total: number;
}

@Component({
  selector: 'app-ventas',
  standalone: false,
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {

  // Lista de clientes simulada
  clientes = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'María', apellido: 'Gómez' }
  ];

  // Productos disponibles para la venta
  productos = [
    { id: 1, nombre: 'Coca Cola 1L', precio: 5.50, stock: 50 },
    { id: 2, nombre: 'Arroz Costeño 1kg', precio: 4.20, stock: 30 },
    { id: 3, nombre: 'Leche Gloria 1L', precio: 3.80, stock: 40 }
  ];

  // Venta actual en proceso
  venta: Venta = {
    id: 0,
    fecha: new Date(),
    clienteId: 0,
    detalle: [],
    total: 0
  };

  // Producto y cantidad seleccionados
  productoSeleccionado: number = 1;
  cantidad: number = 1;

  // Historial de ventas anteriores
  historialVentas: Venta[] = [
    {
      id: 1,
      fecha: new Date('2023-05-15'),
      clienteId: 1,
      detalle: [
        { productoId: 1, cantidad: 2, precioUnitario: 5.50 },
        { productoId: 3, cantidad: 1, precioUnitario: 3.80 }
      ],
      total: 14.80
    },
    {
      id: 2,
      fecha: new Date('2023-05-16'),
      clienteId: 0,
      detalle: [
        { productoId: 2, cantidad: 3, precioUnitario: 4.20 }
      ],
      total: 12.60
    }
  ];

  // Agrega el producto actual a la venta
  agregarProducto(): void {
    const producto = this.productos.find(p => p.id === this.productoSeleccionado);
    if (!producto || this.cantidad <= 0) return;

    const itemExistente = this.venta.detalle.find(item => item.productoId === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += this.cantidad;
    } else {
      this.venta.detalle.push({
        productoId: producto.id,
        cantidad: this.cantidad,
        precioUnitario: producto.precio
      });
    }

    this.cantidad = 1; // Reinicia cantidad
  }

  // Elimina un ítem del detalle
  eliminarItem(index: number): void {
    this.venta.detalle.splice(index, 1);
  }

  // Calcula el total de la venta
  calcularTotal(): number {
    return this.venta.detalle.reduce((total, item) => total + item.cantidad * item.precioUnitario, 0);
  }

  // Finaliza la venta actual
  finalizarVenta(): void {
    this.venta.id = this.historialVentas.length > 0
      ? Math.max(...this.historialVentas.map(v => v.id)) + 1
      : 1;
    this.venta.fecha = new Date();
    this.venta.total = this.calcularTotal();

    this.historialVentas.push({ ...this.venta });

    // Actualiza stock
    this.venta.detalle.forEach(item => {
      const producto = this.productos.find(p => p.id === item.productoId);
      if (producto) producto.stock -= item.cantidad;
    });

    // Reinicia venta
    this.venta = {
      id: 0,
      fecha: new Date(),
      clienteId: 0,
      detalle: [],
      total: 0
    };
  }

  // Muestra los detalles de una venta
  verDetalleVenta(venta: Venta): void {
    let detalle = `Venta N° ${venta.id}\nFecha: ${venta.fecha.toLocaleDateString()}\nCliente: ${venta.clienteId === 0 ? 'Consumidor final' : this.obtenerNombreCliente(venta.clienteId)}\n\nDetalle:\n`;

    venta.detalle.forEach(item => {
      detalle += `${this.obtenerNombreProducto(item.productoId)} - ${item.cantidad} x S/ ${item.precioUnitario.toFixed(2)} = S/ ${(item.cantidad * item.precioUnitario).toFixed(2)}\n`;
    });

    detalle += `\nTotal: S/ ${venta.total.toFixed(2)}`;

    alert(detalle);
  }

  // Retorna el nombre completo del cliente por ID
  obtenerNombreCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
  }

  // Retorna el nombre del producto por ID
  obtenerNombreProducto(id: number): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Desconocido';
  }

  // Retorna el stock actual del producto
  obtenerStockProducto(id: number): number {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.stock : 0;
  }

}
