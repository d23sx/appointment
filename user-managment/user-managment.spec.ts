import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagment } from './user-managment';

describe('UserManagment', () => {
  let component: UserManagment;
  let fixture: ComponentFixture<UserManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
