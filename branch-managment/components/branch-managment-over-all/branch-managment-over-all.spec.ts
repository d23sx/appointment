import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagmentOverAll } from './branch-managment-over-all';

describe('BranchManagmentOverAll', () => {
  let component: BranchManagmentOverAll;
  let fixture: ComponentFixture<BranchManagmentOverAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagmentOverAll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagmentOverAll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
