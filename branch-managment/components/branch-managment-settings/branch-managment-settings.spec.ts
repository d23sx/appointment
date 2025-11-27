import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchManagmentSettings } from './branch-managment-settings';


describe('BranchManagmentSettings', () => {
  let component: BranchManagmentSettings;
  let fixture: ComponentFixture<BranchManagmentSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagmentSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagmentSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
