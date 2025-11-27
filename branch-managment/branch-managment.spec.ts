import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagment } from './branch-managment';

describe('BranchManagment', () => {
  let component: BranchManagment;
  let fixture: ComponentFixture<BranchManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
