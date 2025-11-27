import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDetails } from './appointments-details';

describe('AppointmentsDetails', () => {
  let component: AppointmentsDetails;
  let fixture: ComponentFixture<AppointmentsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
