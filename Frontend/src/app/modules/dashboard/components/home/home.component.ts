import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryService } from 'src/app/modules/shared/services/category.service'; // ajusta el path si es distinto

type ApiStatus = 'LOADING' | 'ONLINE' | 'OFFLINE';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showTips = true;

  categoriesCount: number | null = null;
  lastAction = '—';
  apiStatus: ApiStatus = 'LOADING';

 swaggerUrl = environment.swagger_uri;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showTips = JSON.parse(localStorage.getItem('home_show_tips') ?? 'true');
    this.loadSummary();
  }

  loadSummary(): void {
    this.apiStatus = 'LOADING';

    this.categoryService.getCategories().pipe(take(1)).subscribe({
      next: (categories) => {
        this.categoriesCount = categories.length;
        this.apiStatus = 'ONLINE';
      },
      error: () => {
        this.categoriesCount = 0;
        this.apiStatus = 'OFFLINE';
      }
    });
  }

  toggleTips(value: boolean): void {
    this.showTips = value;
    localStorage.setItem('home_show_tips', JSON.stringify(value));
  }

  goToCategories(): void {
    this.lastAction = 'Ir a categorías';
    this.router.navigate(['/category']); // ajusta ruta real
  }

  goToNewCategory(): void {
    this.lastAction = 'Crear categoría';
    this.router.navigate(['/categories/new']); // ajusta ruta real
  }
}
