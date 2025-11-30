import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadRolComponent } from './seguridad-rol-component';

describe('SeguridadRolComponent', () => {
  let component: SeguridadRolComponent;
  let fixture: ComponentFixture<SeguridadRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
