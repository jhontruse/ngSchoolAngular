import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadUsuarioComponent } from './seguridad-usuario-component';

describe('SeguridadUsuarioComponent', () => {
  let component: SeguridadUsuarioComponent;
  let fixture: ComponentFixture<SeguridadUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
