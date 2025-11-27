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
import { SnackbarAlertComponent, SnackbarType } from '../../../../../../shared/components/snackbar-alert/snackbar-alert.component';

// Define an interface for your event types
interface FormInputEvent {
  type: string;
  value: any;
}

// Define an interface matching the branch structure from data.ts
interface Branches {
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
  selector: 'edit-holiday',
  templateUrl: './edit-holiday.component.html',
  imports: [
    FormCard,
    CommonModule,
    ReactiveFormsModule,
    FormInput,
    MultiSelectComponent,
    SnackbarAlertComponent,
  ],
  styleUrls: ['./edit-holiday.component.css'],
  standalone: true,
})
export class EditHolidayComponent implements OnInit {
  @Input() branches: Branches[] = data.BRANCH_STATUS;
  @Input() holiday: any; // Holiday object to edit
  @Output() closeEditForm = new EventEmitter();
  @Output() updateHoliday = new EventEmitter<any>();

  editHolidayForm!: FormGroup;
  branchOptions: MultiSelectOption[] = [];
  selectedBranches: string[] = [];

  holidayDateType: DatePickerType = 'single'; // Default to single, will be updated based on the holiday

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

  constructor(private fb: FormBuilder) {}

  nackbarMessage3: string = ' تم إضافة إضافة إجازة بنجاح';
  snackbarType3: SnackbarType = 'success';
  showSnackbar3: boolean = false;

  ngOnInit() {
    // Map branch options
    this.branchOptions = this.branches.map((branch) => ({
      id: branch.id.toString(),
      optionName: branch.branchName,
      label: branch.branchName,
      value: branch.id.toString(),
    }));

    // Set initial date type based on the holiday
    if (this.holiday) {
      this.holidayDateType = this.holiday.isDateRange ? 'range' : 'single';

      // Set selected branches
      if (this.holiday.closedBranches) {
        this.selectedBranches = this.holiday.closedBranches;
      }
    }

    // Determine initial date value
    let initialDateValue = null;
    if (this.holiday) {
      if (
        this.holiday.isDateRange &&
        this.holiday.startDate &&
        this.holiday.endDate
      ) {
        initialDateValue = {
          start: new Date(this.holiday.startDate),
          end: new Date(this.holiday.endDate),
        };
      } else if (this.holiday.singleDate) {
        initialDateValue = new Date(this.holiday.singleDate);
      }
    }

    // Initialize form with holiday data if available
    this.editHolidayForm = this.fb.group({
      id: [this.holiday ? this.holiday.id : null],
      holidayName: [
        this.holiday ? this.holiday.holidayName : '',
        [Validators.required, Validators.minLength(3)],
      ],
      holidayDate: [initialDateValue, Validators.required],
      holidayDesc: [this.holiday ? this.holiday.holidayDesc : ''],
      closedBranches: [this.holiday ? this.holiday.closedBranches : []],
    });
  }

  onBranchSelectionChange(selectedItems: any[]) {
    console.log('Selected branches:', selectedItems);

    const selectedBranchIds = selectedItems.map((item) => item.value);
    this.editHolidayForm.get('closedBranches')?.setValue(selectedBranchIds);
    this.selectedBranches = selectedBranchIds;
  }

  // Change method name from onDateModeChange to setDatePickerType if needed
  setDatePickerType(type: DatePickerType) {
    console.log('Date picker type set to:', type);
    this.holidayDateType = type;

    // Reset the date value when type changes
    this.editHolidayForm.get('holidayDate')?.setValue(null);
  }

  // Handler for single date changes
  onSingleDateChange(date: Date | null) {
    console.log('Single date selected:', date);
    this.editHolidayForm.get('holidayDate')?.setValue(date);
  }

  // Handler for date range changes
  onDateRangeChange(dateRange: DateRange) {
    console.log('Date range selected:', dateRange);
    this.editHolidayForm.get('holidayDate')?.setValue(dateRange);
  }

  // Handler for clearing dates
  onDateCleared() {
    console.log('Date cleared');
    this.editHolidayForm.get('holidayDate')?.setValue(null);
  }

  // Helper methods to access form controls
  get holidayNameControl(): FormControl {
    return this.editHolidayForm.get('holidayName') as FormControl;
  }

  get holidayDateControl(): FormControl {
    return this.editHolidayForm.get('holidayDate') as FormControl;
  }

  get holidayDescControl(): FormControl {
    return this.editHolidayForm.get('holidayDesc') as FormControl;
  }

  get closedBranchesControl(): FormControl {
    return this.editHolidayForm.get('closedBranches') as FormControl;
  }

  onClose() {
    this.closeEditForm.emit();
  }

  onSubmit() {
    if (this.editHolidayForm.valid) {
      const formData = this.editHolidayForm.value;
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

      // For editing, preserve the original ID instead of creating a new one
      const updatedHoliday = {
        ...formData,
        ...holidayDateInfo,
        id: formData.id || this.holiday.id, // Preserve the original ID
        closedBranchDetails,
        affectedBranchCount: formData.closedBranches?.length || 0,
      };

      console.log('Updated Holiday:', updatedHoliday);
      this.showSnackbar3 = true;

      setTimeout(() => {
        this.showSnackbar3 = false;
        this.updateHoliday.emit(updatedHoliday);
        this.closeEditForm.emit();
      }, 5000);
    } else {
      console.log('Invalid form');
      // Mark all fields as touched to show validation errors
      Object.keys(this.editHolidayForm.controls).forEach((key) => {
        const control = this.editHolidayForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
