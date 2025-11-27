import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagmentHoliday } from './branch-managment-holiday';

describe('BranchManagmentHoliday', () => {
  let component: BranchManagmentHoliday;
  let fixture: ComponentFixture<BranchManagmentHoliday>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagmentHoliday]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagmentHoliday);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
