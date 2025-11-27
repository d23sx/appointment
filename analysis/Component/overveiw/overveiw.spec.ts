import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Overveiw } from './overveiw';

describe('Overveiw', () => {
  let component: Overveiw;
  let fixture: ComponentFixture<Overveiw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overveiw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Overveiw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
