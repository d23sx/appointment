import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormCard } from '../../../../../../shared/form/form-card/form-card';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../../../../shared/form/form-input/form-input';
import { IconConstant } from '../../../../../../shared/constants/icon-constants/icon-constant';
import { data } from '../../../../../../app/data';
import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../../../../shared/components/multi-select/multi-select.component';
import {
  DatePickerType,
  DateRange,
} from '../../../../../../shared/components/date-picker/date-picker.component';
import {
  SnackbarAlertComponent,
  SnackbarType,
} from '../../../../../../shared/components/snackbar-alert/snackbar-alert.component';
// Define an interface for your event types
interface FormInputEvent {
  type: string;
  value: any;
}
// Define an interface matching the branch structure from data.ts
export interface Branches {
  id: number;
  branchName: string;
  status: string;
  cancledAttendancesCount: number;
  attendanceCount: number;
  appointmentsCount: number;
  waitTime: string;
  statusDescription: string;
}
@Component({
  selector: 'add-holiday',
  templateUrl: './add-holiday.component.html',
  imports: [
    FormCard,
    CommonModule,
    ReactiveFormsModule,
    FormInput,
    MultiSelectComponent,
    SnackbarAlertComponent,
  ],
  styleUrls: ['./add-holiday.component.css'],
  standalone: true,
})
export class AddHolidayComponent implements OnInit {
  @Input() branches: Branches[] = data.BRANCH_STATUS;
  @Output() closeAddForm = new EventEmitter();
  @Output() addHoliday = new EventEmitter<any>();
  addHolidayForm!: FormGroup;
  branchOptions: MultiSelectOption[] = [];
  selectedBranches: string[] = [];
  holidayDateType: DatePickerType = 'range';
  readonly icons = {
    plus: IconConstant.DIAMOND_PLUS,
    user: IconConstant.USERS,
    cpr: IconConstant.CPR,
    email: IconConstant.EMAIL,
    phone: IconConstant.PHONE,
    location: IconConstant.LOCATION,
    warning: IconConstant.WARNING,
    branch: IconConstant.BRANCH_MANAGEMENT,
    calendar: IconConstant.CALENDAR,
    clock: IconConstant.CLOCK,
    cr: IconConstant.CR,
    folder: IconConstant.FolderPin,
    close: IconConstant.CLOSE,
    pannelRightClose: IconConstant.PANNELRIGHTCLOSE,
    pannelRightOpen: IconConstant.PANNELRIGHTOPEN,
    trash: IconConstant.TRASH,
  };

  nackbarMessage3: string = ' تم إضافة إضافة إجازة بنجاح';
  snackbarType3: SnackbarType = 'success';
  showSnackbar3: boolean = false;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    // Initialize form with branches control and explicit null for date
    this.addHolidayForm = this.fb.group({
      holidayName: ['', [Validators.required, Validators.minLength(3)]],
      holidayDate: [null, Validators.required],
      holidayDesc: [''],
      closedBranches: [[]],
    });
    this.branchOptions = this.branches.map((branch) => ({
      id: branch.id.toString(),
      optionName: branch.branchName,
      label: branch.branchName,
      value: branch.id.toString(),
    }));
  }
  onBranchSelectionChange(selectedBranchIds: string[]) {
    console.log('Selected branches:', selectedBranchIds);
    this.addHolidayForm.get('closedBranches')?.setValue(selectedBranchIds);
    this.selectedBranches = selectedBranchIds;
  }
  // Change method name from onDateModeChange to setDatePickerType if needed
  setDatePickerType(type: DatePickerType) {
    console.log('Date picker type set to:', type);
    this.holidayDateType = type;
    // Reset the date value when type changes
    this.addHolidayForm.get('holidayDate')?.setValue(null);
  }
  // Handler for single date changes
  onSingleDateChange(date: Date | null) {
    console.log('Single date selected:', date);
    this.addHolidayForm.get('holidayDate')?.setValue(date);
  }
  // Handler for date range changes
  onDateRangeChange(dateRange: DateRange) {
    console.log('Date range selected:', dateRange);
    this.addHolidayForm.get('holidayDate')?.setValue(dateRange);
  }
  // Handler for clearing dates
  onDateCleared() {
    console.log('Date cleared');
    this.addHolidayForm.get('holidayDate')?.setValue(null);
  }
  // Helper methods to access form controls
  get holidayNameControl(): FormControl {
    return this.addHolidayForm.get('holidayName') as FormControl;
  }
  get holidayDateControl(): FormControl {
    return this.addHolidayForm.get('holidayDate') as FormControl;
  }
  get holidayDescControl(): FormControl {
    return this.addHolidayForm.get('holidayDesc') as FormControl;
  }
  get closedBranchesControl(): FormControl {
    return this.addHolidayForm.get('closedBranches') as FormControl;
  }
  onClose() {
    this.closeAddForm.emit();
  }
  onSubmit() {
    if (this.addHolidayForm.valid) {
      const formData = this.addHolidayForm.value;
      const dateValue = formData.holidayDate;
      const closedBranchDetails = this.branches.filter((branch) =>
        formData.closedBranches?.includes(branch.id.toString())
      );
      // Process the date information based on type
      let holidayDateInfo: any = {};
      if (dateValue instanceof Date) {
        holidayDateInfo = {
          singleDate: dateValue,
          startDate: null,
          endDate: null,
          isDateRange: false,
        };
      } else if (
        dateValue &&
        typeof dateValue === 'object' &&
        'start' in dateValue &&
        'end' in dateValue
      ) {
        // It's a date range
        holidayDateInfo = {
          singleDate: null,
          startDate: dateValue.start,
          endDate: dateValue.end,
          isDateRange: true,
        };
      }
      const newHoliday = {
        ...formData,
        ...holidayDateInfo,
        id: Date.now(),
        closedBranchDetails,
        affectedBranchCount: formData.closedBranches?.length || 0,
      };
      this.showSnackbar3 = true;

      setTimeout(() => {
        this.showSnackbar3 = false;
          this.addHoliday.emit(newHoliday);
          this.closeAddForm.emit();
      }, 5000);

      console.log('New Holiday:', newHoliday);
      // this.addHoliday.emit(newHoliday);
      // this.closeAddForm.emit();
    } else {
      console.log('Invalid form');
      // Mark all fields as touched to show validation errors
      Object.keys(this.addHolidayForm.controls).forEach((key) => {
        const control = this.addHolidayForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
