import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Not500Component } from './not500-component';

describe('Not500Component', () => {
  let component: Not500Component;
  let fixture: ComponentFixture<Not500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Not500Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Not500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
