import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './components/category.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { MaterialModuleOptimized } from '../shared/material-optimized.module';
import { AddCategoryComponent } from './components/add-category/add-category.component';

/**
 * Módulo de Categorías
 *
 * Feature module que contiene todos los componentes y funcionalidades
 * relacionadas con la gestión de categorías (CRUD).
 *
 * @module
 */
@NgModule({
  declarations: [
    CategoryComponent,
    NewCategoryComponent,
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    MaterialModuleOptimized,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
