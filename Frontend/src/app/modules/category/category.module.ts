import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleOptimized } from '../shared/material-optimized.module';
import { SharedModule } from '../shared/shared.module';
import {
  AddCategoryComponent,
  CategoryComponent,
  EditCategoryComponent
} from './components';

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
    AddCategoryComponent,
    EditCategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModuleOptimized,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CategoryComponent
  ]
})
export class CategoryModule { }
