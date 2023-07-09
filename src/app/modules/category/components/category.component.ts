import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();

  }

  //arreglo de string
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories(){
    this.categoryService.getCategories().subscribe(data => {
          console.log("respuesta categories", data );
    }, (error => console.log("error", error)))
  }
}

//elemento interface tipo de datos que se construye para ocuparlo en determinadas tareas
export interface CategoryElement{
  
 description: string;
 id: number; 
 name: string;

}
