import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBranch } from './add-branch';

describe('AddBranch', () => {
  let component: AddBranch;
  let fixture: ComponentFixture<AddBranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBranch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBranch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
