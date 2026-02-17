import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { StockManagementComponent } from './stock-management.component';
import { ProductService } from '../../services/product.service';

describe('StockManagementComponent', () => {
  let component: StockManagementComponent;
  let fixture: ComponentFixture<StockManagementComponent>;

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockManagementComponent],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
