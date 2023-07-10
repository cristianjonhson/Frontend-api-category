import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // Inyectar el servicio CategoryService
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    // Llamar al método para obtener las categorías
    this.getCategories();
  }

  // Arreglo de nombres de columnas para la tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  
  // Fuente de datos para la tabla
  dataSource: MatTableDataSource<CategoryElement>;

  // Propiedad para almacenar el mensaje de error
  errormensaje: string;

  // Método para obtener las categorías
  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        // Procesar la respuesta
        this.processCategoriesResponse(data);
      },
      error: (error) => {
        // Asignar mensaje de error
        this.errormensaje = 'Ocurrió un error al obtener las categorías.';
        console.log("error", error.message);
      }
    });
  }

  // Método para procesar la respuesta de categorías
  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listCategory = resp.categoryResponse.category;

      console.log(listCategory, "hola");

      // Asignar los datos a la fuente de datos de la tabla
      this.dataSource = new MatTableDataSource<CategoryElement>(listCategory);
     
      console.log(this.dataSource.data, "data");
    }
  }
}

//elemento interface tipo de datos que se construye para ocuparlo en determinadas tareas
export interface CategoryElement {

  description: string;
  id: number;
  name: string;

}
