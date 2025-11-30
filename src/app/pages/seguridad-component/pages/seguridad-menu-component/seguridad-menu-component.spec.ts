import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadMenuComponent } from './seguridad-menu-component';

describe('SeguridadMenuComponent', () => {
  let component: SeguridadMenuComponent;
  let fixture: ComponentFixture<SeguridadMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
