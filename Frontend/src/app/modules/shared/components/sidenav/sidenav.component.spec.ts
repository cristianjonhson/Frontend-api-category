import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaMatcher } from '@angular/cdk/layout';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  const mediaMatcherMock = {
    matchMedia: jasmine.createSpy('matchMedia').and.returnValue({
      matches: false,
      media: '(max-width: 600px)',
      onchange: null,
      dispatchEvent: () => false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined
    } as unknown as MediaQueryList)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      providers: [{ provide: MediaMatcher, useValue: mediaMatcherMock }]
    })
      .overrideTemplate(SidenavComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include reports in navigation items', () => {
    expect(component.menuNav).toContain(jasmine.objectContaining({
      name: 'Reportes',
      route: 'reports'
    }));
  });
});
