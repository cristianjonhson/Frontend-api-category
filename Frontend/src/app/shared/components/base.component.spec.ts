import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponent } from './base.component';

@Component({
  selector: 'app-test-base-host',
  template: ''
})
class TestBaseHostComponent extends BaseComponent {}

describe('BaseComponent', () => {
  let component: TestBaseHostComponent;
  let fixture: ComponentFixture<TestBaseHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestBaseHostComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBaseHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create host that extends BaseComponent', () => {
    expect(component).toBeTruthy();
  });
});
