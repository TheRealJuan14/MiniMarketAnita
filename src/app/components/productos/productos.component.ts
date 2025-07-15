import { Component } from '@angular/core';
import { CategoriasComponent } from '../categorias/categorias.component';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
}

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  categorias = [
    { id: 1, nombre: 'Bebidas' },
    { id: 2, nombre: 'Abarrotes' },
    { id: 3, nombre: 'Lácteos' }
  ];

  productos: Producto[] = [
    { id: 1, nombre: 'Coca Cola 1L', descripcion: 'Gaseosa', precio: 5.50, stock: 50, categoriaId: 1 },
    { id: 2, nombre: 'Arroz Costeño 1kg', descripcion: 'Arroz extra', precio: 4.20, stock: 30, categoriaId: 2 },
    { id: 3, nombre: 'Leche Gloria 1L', descripcion: 'Leche entera', precio: 3.80, stock: 40, categoriaId: 3 }
  ];

  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 1
  };

  agregarProducto() {
    if (this.nuevoProducto.nombre.trim() === '') return;
    
    this.nuevoProducto.id = this.productos.length > 0 
      ? Math.max(...this.productos.map(p => p.id)) + 1 
      : 1;
    
    this.productos.push({...this.nuevoProducto});
    this.resetearFormulario();
  }

  editarProducto(producto: Producto) {
    this.nuevoProducto = {...producto};
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  obtenerNombreCategoria(id: number): string {
    const categoria = this.categorias.find(c => c.id === id);
    return categoria ? categoria.nombre : 'Desconocida';
  }

  resetearFormulario() {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: 1
    };
  }
}