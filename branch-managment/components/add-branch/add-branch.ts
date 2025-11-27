import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../../shared/components/multi-select/multi-select.component';
import { LucideAngularModule } from 'lucide-angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Days,
  DAYS_OPTIONS,
  StatusOptions,
} from '../branch-managment-settings/branch-managment-settings-data';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';
import { TimeRange } from '../../../../shared/components/time/time.component';
import { FormInput } from '../../../../shared/form/form-input/form-input';
import { data } from '../../../../app/data';
import { MessageBoxComponent } from '../../../../shared/components/message-box/message-box.component';
import {
  SnackbarType,
  SnackbarAlertComponent,
} from '../../../../shared/components/snackbar-alert/snackbar-alert.component';
import { falseInput } from '../../../../app/validation';
import { DisplayInfo } from '../../../../shared/components/display-info/display-info';

@Component({
  selector: 'app-add-branch',
  imports: [
    CommonModule,
    CustomButton,
    MultiSelectComponent,
    ReactiveFormsModule,
    LucideAngularModule,
    FormInput,
    MessageBoxComponent,
    SnackbarAlertComponent,
    DisplayInfo,
  ],
  templateUrl: './add-branch.html',
  styleUrl: './add-branch.css',
})
export class AddBranch {
  @Input() days: Days[] = DAYS_OPTIONS;
  @Output() showForm = new EventEmitter<boolean>();

  readonly icons = {
    branch: IconConstant.BRANCH_MANAGEMENT,
    calendar: IconConstant.CALENDAR,
  };
  submmited = false;

  snackbarMessage1: string = ' يرجى تأكيد إدراج المواعيد المُدخلة ';
  snackbarType1: SnackbarType = 'confirm';
  showSnackbar1: boolean = false;

  snackbarMessage2: string = ' يرجى التأكد من المعلومات المُدخلة ';
  snackbarType2: SnackbarType = 'error';
  showSnackbar2: boolean = false;

  snackbarMessage3: string = ' تم إضافة فر ع بنجاح';
  snackbarType3: SnackbarType = 'success';
  showSnackbar3: boolean = false;

  title = data.ADD_BRANCH_FORM_TITLE;
  namePlaceholder = data.ADD_BRANCH_FORM_BRANCH_NAME_PLACEHOLDER;

  workingHours: TimeRange | null = null;
  addBranchForm: FormGroup;

  // Working days options
  daysOptions: MultiSelectOption[] = [];
  selectedDays: string[] = [];

  // Default selected days
  defaultSelectedDays: string[] = ['1', '2', '3', '4', '5']; // Sunday through Thursday

  constructor(private fb: FormBuilder) {
    this.addBranchForm = this.fb.group({
      workingHours: this.fb.control({ start: '', end: '' }, [
        Validators.required,
      ]),
      branchName: this.fb.control('', Validators.required),
      branchAddress: this.fb.control('', Validators.required),
      employeeCount: this.fb.control('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      counterCount: this.fb.control('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      workingDays: this.fb.control(
        this.defaultSelectedDays,
        Validators.required
      ),
    });

    this.daysOptions = this.days.map((days) => ({
      id: days.id.toString(),
      optionName: days.dayName,
      label: days.dayName,
      value: days.id.toString(),
    }));
  }

  get employeeCount(): FormControl {
    return this.addBranchForm.get('employeeCount') as FormControl;
  }
  get workingDays(): FormControl {
    const selected = this.addBranchForm.get('selectedDays')?.value;
    if (selected === '') {
      this.addBranchForm
        .get('selectedDays')
        ?.setValue(this.defaultSelectedDays);
    }

    return this.addBranchForm.get('selectedDays') as FormControl;
  }
  get branchName(): FormControl {
    return this.addBranchForm.get('branchName') as FormControl;
  }
  get counterCount(): FormControl {
    return this.addBranchForm.get('counterCount') as FormControl;
  }

  get branchAddress(): FormControl {
    return this.addBranchForm.get('branchAddress') as FormControl;
  }



  get workingHour(): FormControl {
    return this.addBranchForm.get('workingHours') as FormControl;
  }

  workingHoursString(): string {
    const value = this.addBranchForm.get('workingHours')?.value as {
      start: string | null;
      end: string | null;
    } | null;

    const start = value?.start ?? '-';
    const end = value?.end ?? '-';

    return `${start} - ${end}`;
  }

  get selectedDayNames(): string[] {
    const selectedIds: string[] =
      this.addBranchForm.get('workingDays')?.value || [];

    return this.days
      .filter((day) => selectedIds.includes(day.id.toString()))
      .map((day) => day.dayName + '  ');
  }

  // Handle working days selection changes
  onWorkingDaysChange(selectedDays: string[]) {
    this.selectedDays = selectedDays;
    this.addBranchForm.patchValue({ workingDays: selectedDays });

    // Mark the control as touched for validation
    this.addBranchForm.get('workingDays')?.markAsTouched();
  }

  // Get form validation status
  isFormValid(): boolean {
    return this.addBranchForm.valid;
  }

  // Get specific field errors
  getFieldError(fieldName: string): string | null {
    const field = this.addBranchForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'هذا الحقل مطلوب';
      if (field.errors['min']) return 'القيمة يجب أن تكون أكبر من صفر';
    }
    return null;
  }

  // Get form field value
  getFormValue(fieldName: string): any {
    return this.addBranchForm.get(fieldName)?.value;
  }

  // Check if field is valid
  isFieldValid(fieldName: string): boolean {
    const field = this.addBranchForm.get(fieldName);
    return field ? field.valid || !field.touched : true;
  }

  // Get form summary for debugging
  getFormSummary() {
    return {
      isValid: this.addBranchForm.valid,
      values: this.addBranchForm.value,
      errors: this.getFormErrors(),
    };
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.addBranchForm.controls).forEach((key) => {
      const control = this.addBranchForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  ConfirmSubmit() {
    this.showSnackbar1 = true;
    this.snackbarMessage1 == ' يرجى تأكيد إدراج المواعيد المُدخلة ';
  }

  onSnackbarDismissed() {
    this.showSnackbar1 = false;
  }
  onSnackbarDismissed2() {
    this.showSnackbar2 = false;
  }

  goHome() {
    this.showForm.emit();
  }
  saveSettings() {
    if (this.addBranchForm.valid) {
      const formData = this.addBranchForm.value;

      // Generate the complete settings object
      const branchSettings = {
        branchName: formData.branchName,
        branchAddress: formData.branchAddress,
        employeeCount: formData.employeeCount,
        counterCount: formData.counterCount,
        workingHours: formData.workingHours,
        workingDays: formData.workingDays,
        timestamp: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      // Here you would typically send this to your backend API
      console.log('Saving branch settings:', branchSettings);
      console.log('Form summary:', this.getFormSummary());

      this.showSnackbar1 = false;
      this.showSnackbar3 = true;

      setTimeout(() => {
        this.showSnackbar3 = false;
      }, 5000);

      this.submmited = true;
    } else {
      this.onSnackbarDismissed();
      this.showSnackbar2 = true;
      Object.values(this.addBranchForm.controls).forEach((control) => {
        control.markAsTouched();
        this.showSnackbar1 = false;

        this.showSnackbar2 = true;
      });

      console.log('Form is invalid:', this.addBranchForm.errors);

      // Mark all fields as touched to show validation errors
      Object.keys(this.addBranchForm.controls).forEach((key) => {
        this.addBranchForm.get(key)?.markAsTouched();
      });
    }
  }
}
