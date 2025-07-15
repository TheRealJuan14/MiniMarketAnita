import { Component, OnInit } from '@angular/core';
import { CategoriasService, Categoria } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  standalone: false
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[] = [];

  nuevaCategoria: Partial<Categoria> = {
    nombre: '',
    descripcion: ''
  };

  editando: boolean = false;
  idEditando: number | null = null;

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (data: Categoria[]) => this.categorias = data,
      error: (err: any) => console.error('Error al cargar categorías', err)
    });
  }

  agregarCategoria() {
    if (!this.nuevaCategoria.nombre?.trim()) return;

    if (this.editando && this.idEditando !== null) {
      // Editar
      this.categoriasService.actualizarCategoria(this.idEditando, this.nuevaCategoria)
        .subscribe({
          next: (categoriaActualizada: Categoria) => {
            const index = this.categorias.findIndex(c => c.id === this.idEditando);
            if (index !== -1) this.categorias[index] = categoriaActualizada;
            this.limpiarFormulario();
          },
          error: (err: any) => console.error('Error al actualizar categoría', err)
        });
    } else {
      // Crear
      this.categoriasService.crearCategoria(this.nuevaCategoria)
        .subscribe({
          next: (categoriaCreada: Categoria) => {
            this.categorias.push(categoriaCreada);
            this.limpiarFormulario();
          },
          error: (err: any) => console.error('Error al crear categoría', err)
        });
    }
  }

  editarCategoria(categoria: Categoria) {
    this.nuevaCategoria = {...categoria};
    this.editando = true;
    this.idEditando = categoria.id;
  }

  eliminarCategoria(id: number) {
    this.categoriasService.eliminarCategoria(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.id !== id);
      },
      error: (err: any) => console.error('Error al eliminar categoría', err)
    });
  }

  limpiarFormulario() {
    this.nuevaCategoria = { nombre: '', descripcion: '' };
    this.editando = false;
    this.idEditando = null;
  }
}
