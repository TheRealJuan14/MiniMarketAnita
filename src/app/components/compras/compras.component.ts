import { Component } from '@angular/core';

interface DetalleCompra {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

interface Compra {
  id: number;
  fecha: Date;
  proveedorId: number;
  detalle: DetalleCompra[];
  total: number;
}

@Component({
  selector: 'app-compras',
  standalone: false,
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {
  proveedores = [
    { id: 1, nombre: 'Distribuidora ABC' },
    { id: 2, nombre: 'Mayorista XYZ' },
    { id: 3, nombre: 'Importaciones LMN' }
  ];

  productos = [
    { id: 1, nombre: 'Coca Cola 1L', stock: 50 },
    { id: 2, nombre: 'Arroz Costeño 1kg', stock: 30 },
    { id: 3, nombre: 'Leche Gloria 1L', stock: 40 }
  ];

  compra: Compra = {
    id: 0,
    fecha: new Date(),
    proveedorId: 1,
    detalle: [],
    total: 0
  };

  productoSeleccionado: number = 1;
  cantidadCompra: number = 1;
  precioCompra: number = 0;

  historialCompras: Compra[] = [
    {
      id: 1,
      fecha: new Date('2023-05-10'),
      proveedorId: 1,
      detalle: [
        { productoId: 1, cantidad: 20, precioUnitario: 4.50 },
        { productoId: 3, cantidad: 15, precioUnitario: 3.00 }
      ],
      total: 135.00
    },
    {
      id: 2,
      fecha: new Date('2023-05-12'),
      proveedorId: 2,
      detalle: [
        { productoId: 2, cantidad: 30, precioUnitario: 3.50 }
      ],
      total: 105.00
    }
  ];

  agregarProductoCompra() {
    if (this.precioCompra <= 0 || this.cantidadCompra <= 0) return;
    
    // Verificar si el producto ya está en el detalle
    const itemExistente = this.compra.detalle.find(item => item.productoId === this.productoSeleccionado);
    
    if (itemExistente) {
      itemExistente.cantidad += this.cantidadCompra;
    } else {
      this.compra.detalle.push({
        productoId: this.productoSeleccionado,
        cantidad: this.cantidadCompra,
        precioUnitario: this.precioCompra
      });
    }
    
    this.cantidadCompra = 1;
    this.precioCompra = 0;
  }

  eliminarItemCompra(index: number) {
    this.compra.detalle.splice(index, 1);
  }

  calcularTotalCompra(): number {
    return this.compra.detalle.reduce((total, item) => total + (item.cantidad * item.precioUnitario), 0);
  }

  finalizarCompra() {
    this.compra.id = this.historialCompras.length > 0 
      ? Math.max(...this.historialCompras.map(c => c.id)) + 1 
      : 1;
    this.compra.fecha = new Date();
    this.compra.total = this.calcularTotalCompra();
    
    this.historialCompras.push({...this.compra});
    
    // Actualizar stock de productos
    this.compra.detalle.forEach(item => {
      const producto = this.productos.find(p => p.id === item.productoId);
      if (producto) {
        producto.stock += item.cantidad;
      }
    });
    
    // Resetear compra
    this.compra = {
      id: 0,
      fecha: new Date(),
      proveedorId: 1,
      detalle: [],
      total: 0
    };
  }

  verDetalleCompra(compra: Compra) {
    let detalle = `Compra N° ${compra.id}\nFecha: ${compra.fecha.toLocaleDateString()}\nProveedor: ${this.obtenerNombreProveedor(compra.proveedorId)}\n\nDetalle:\n`;
    
    compra.detalle.forEach(item => {
      detalle += `${this.obtenerNombreProducto(item.productoId)} - ${item.cantidad} x S/ ${item.precioUnitario.toFixed(2)} = S/ ${(item.cantidad * item.precioUnitario).toFixed(2)}\n`;
    });
    
    detalle += `\nTotal: S/ ${compra.total.toFixed(2)}`;
    
    alert(detalle);
  }

  obtenerNombreProveedor(id: number): string {
    const proveedor = this.proveedores.find(p => p.id === id);
    return proveedor ? proveedor.nombre : 'Desconocido';
  }

  obtenerNombreProducto(id: number): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Desconocido';
  }
}