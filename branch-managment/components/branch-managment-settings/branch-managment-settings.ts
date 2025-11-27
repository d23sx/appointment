import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../../shared/components/multi-select/multi-select.component';
import { FormInput } from '../../../../shared/form/form-input/form-input';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';
import {
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Days,
  DAYS_OPTIONS,
} from './branch-managment-settings-data';
import { LucideAngularModule } from 'lucide-angular';
import { TimeRange } from '../../../../shared/components/time/time.component';
import {
  SnackbarType,
} from '../../../../shared/components/snackbar-alert/snackbar-alert.component';
import { MessageBoxComponent } from '../../../../shared/components/message-box/message-box.component';

@Component({
  selector: 'branch-managment-settings',
  imports: [
    CommonModule,
    CustomButton,
    MultiSelectComponent,
    FormInput,
    ReactiveFormsModule,
    LucideAngularModule,
    MessageBoxComponent,
  ],
  templateUrl: './branch-managment-settings.html',
  styleUrl: './branch-managment-settings.css',
})
export class BranchManagmentSettings implements OnInit {
  @Input() selectedBranch: any = null;
  @Output() navigateBack = new EventEmitter<void>();
  @Output() showsucess = new EventEmitter<void>();

  workingHours: TimeRange | null = null;
  settingsForm: FormGroup;

  snackbarMessage1: string = 'يرجى تأكيد إضافة فرع جديد ';
  snackbarType1: SnackbarType = 'confirm';
  showSnackbar1: boolean = false;

  snackbarMessage2: string = ' يرجى التأكد من المعلومات المُدخلة ';
  snackbarType2: SnackbarType = 'error';
  showSnackbar2: boolean = false;

  ConfirmSubmit() {
    this.showSnackbar1 = true;
    this.snackbarMessage1 == ' يرجى تأكيد إضافة فرع جديد ';
  }

  onSnackbarDismissed() {
    this.showSnackbar1 = false;
  }
  onSnackbarDismissed2() {
    this.showSnackbar2 = false;
  }

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      workingHours: this.fb.control({ start: '', end: '' }, [
        Validators.required,
      ]),
      branchName: this.fb.control('', Validators.required),
      branchAddress: this.fb.control('', Validators.required),
      employeeCount: this.fb.control('', [
        Validators.required,
        Validators.min(1),
      ]),
      counterCount: this.fb.control('', [
        Validators.required,
        Validators.min(1),
      ]),
      status: this.fb.control('', Validators.required),
      workingDays: this.fb.control([], Validators.required),
      // services: this.fb.control([], Validators.required),
      // newServiceName: this.fb.control('')
    });
  }

  get branchName(): FormControl {
    return this.settingsForm.get('branchName') as FormControl;
  }
  get counterCount(): FormControl {
    return this.settingsForm.get('counterCount') as FormControl;
  }

  get branchAddress(): FormControl {
    return this.settingsForm.get('branchAddress') as FormControl;
  }

  get workingHour(): FormControl {
    return this.settingsForm.get('workingHours') as FormControl;
  }

  get workingDay(): FormControl {
    return this.settingsForm.get('workingDays') as FormControl;
  }

  get status(): FormControl {
    return this.settingsForm.get('status') as FormControl;
  }

  get counterCounts(): FormControl {
    return this.settingsForm.get('counterCount') as FormControl;
  }

  get employeeCount(): FormControl {
    return this.settingsForm.get('employeeCount') as FormControl;
  }

  // Handle working days selection changes
  onWorkingDaysChange(selectedDays: string[]) {
    this.selectedDays = selectedDays;
    this.settingsForm.patchValue({ workingDays: selectedDays });

    // Mark the control as touched for validation
    this.settingsForm.get('workingDays')?.markAsTouched();
  }

  // Handle cancel/disable service selection changes
  // onCancelOrDisableServicesChange(selectedServices: string[]) {
  //   this.selectedCancelOrDisableServiceOptions = selectedServices;
  // }

  // Get form validation status
  isFormValid(): boolean {
    return this.settingsForm.valid;
  }

  // Get specific field errors
  getFieldError(fieldName: string): string | null {
    const field = this.settingsForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'هذا الحقل مطلوب';
      if (field.errors['min']) return 'القيمة يجب أن تكون أكبر من صفر';
    }
    return null;
  }

  // Get form field value
  getFormValue(fieldName: string): any {
    return this.settingsForm.get(fieldName)?.value;
  }

  // Check if field is valid
  isFieldValid(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return field ? field.valid || !field.touched : true;
  }

  // Get form summary for debugging
  getFormSummary() {
    return {
      isValid: this.settingsForm.valid,
      values: this.settingsForm.value,
      errors: this.getFormErrors(),
    };
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.settingsForm.controls).forEach((key) => {
      const control = this.settingsForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
  @Input() days: Days[] = DAYS_OPTIONS;

  readonly icons = {
    branch: IconConstant.BRANCH_MANAGEMENT,
    calendar: IconConstant.CALENDAR,
  };

  // Working days options
  daysOptions: MultiSelectOption[] = [];
  selectedDays: string[] = [];

  // Default selected days
  defaultSelectedDays: string[] = ['1', '2', '3', '4', '5']; // Sunday through Thursday

  // // Services options
  // servicesOptions: MultiSelectOption[] = [];
  // selectedServicesOptions: string[] = [];

  // Status options
  statusSelectOptions: { value: any; label: string }[] = [];
  selectedStatusOptions: string[] = [];

  // // Service options for disabling/canceling
  // cancelOrDisableServiceOptions: MultiSelectOption[] = [];
  // selectedCancelOrDisableServiceOptions: string[] = [];

  // Default values

  ngOnInit() {
    // Initialize working hours with default values
    this.workingHours = {
      start: '07:00',
      end: '15:00',
    };

    // If a branch is selected, use its data; otherwise use defaults

    // Set initial form values with selected branch data or defaults
    this.settingsForm.patchValue({
      workingDays: this.defaultSelectedDays,
    });

    // Initialize working days options
    this.daysOptions = this.days.map((days) => ({
      id: days.id.toString(),
      optionName: days.dayName,
      label: days.dayName,
      value: days.id.toString(),
    }));

    // Set default selected days
    this.selectedDays = this.defaultSelectedDays;}

    // Initialize services options
    // this.servicesOptions = [
    //   {
    //     id: '1',
    //     optionName: 'خدمة الاستعلام',
    //     label: 'خدمة الاستعلام',
    //     value: '1',
    //   },
    //   { id: '2', optionName: 'خدمة الدفع', label: 'خدمة الدفع', value: '2' },
    //   {
    //     id: '3',
    //     optionName: 'خدمة الشكاوى',
    //     label: 'خدمة الشكاوى',
    //     value: '3',
    //   },
    //   {
    //     id: '4',
    //     optionName: 'خدمة المتابعة',
    //     label: 'خدمة المتابعة',
    //     value: '4',
    //   },
    // ];

    // // Set default selected services
    // this.selectedServicesOptions = ['1', '2'];

    // // Transform status options for select component
    // this.statusSelectOptions = StatusOptions.map((status) => ({
    //   value: status.id,
    //   label: status.optionName,
    // }));

    // Initialize service options for disabling/canceling
  //   this.cancelOrDisableServiceOptions = [...this.servicesOptions];
  //   this.selectedStatusOptions = ['completed']; // Default to completed
  // }

  // Methods for handling button actions
  // addService() {
  //   const newServiceName = this.settingsForm
  //     .get('newServiceName')
  //     ?.value?.trim();

  //   if (!newServiceName) {
  //     alert('يرجى إدخال اسم الخدمة');
  //     return;
  //   }

  //   // Generate a new service ID
  //   const newServiceId = (this.servicesOptions.length + 1).toString();
  //   const newService = {
  //     id: newServiceId,
  //     optionName: newServiceName,
  //     label: newServiceName,
  //     value: newServiceId,
  //   };

  //   // Add to services options
  //   this.servicesOptions.push(newService);

  //   // Add to selected services
  //   this.selectedServicesOptions.push(newServiceId);

  //   // Update cancel/disable options
  //   this.cancelOrDisableServiceOptions = [...this.servicesOptions];

  //   // Update form
  //   this.settingsForm.patchValue({
  //     services: this.selectedServicesOptions,
  //     newServiceName: '', // Clear the input
  //   });

  //   console.log('Added new service:', newService);
  // }

  // disableService() {
  //   if (this.selectedCancelOrDisableServiceOptions.length === 0) {
  //     console.log('No services selected to disable');
  //     return;
  //   }

  //   // Remove selected services from active services
  //   this.selectedServicesOptions = this.selectedServicesOptions.filter(
  //     (serviceId) =>
  //       !this.selectedCancelOrDisableServiceOptions.includes(serviceId)
  //   );

  //   // Update form
  //   this.settingsForm.patchValue({
  //     services: this.selectedServicesOptions,
  //   });

  //   console.log(
  //     'Disabled services:',
  //     this.selectedCancelOrDisableServiceOptions
  //   );
  //   console.log('Remaining active services:', this.selectedServicesOptions);

  //   // Clear selection
  //   this.selectedCancelOrDisableServiceOptions = [];
  // }

  // cancelService() {
  //   if (this.selectedCancelOrDisableServiceOptions.length === 0) {
  //     console.log('No services selected to cancel');
  //     return;
  //   }

  //   // Remove selected services completely from options
  //   this.servicesOptions = this.servicesOptions.filter(
  //     (service) =>
  //       service.value &&
  //       !this.selectedCancelOrDisableServiceOptions.includes(service.value)
  //   );

  //   // Remove from active services as well
  //   this.selectedServicesOptions = this.selectedServicesOptions.filter(
  //     (serviceId) =>
  //       !this.selectedCancelOrDisableServiceOptions.includes(serviceId)
  //   );

  //   // Update cancel/disable options
  //   this.cancelOrDisableServiceOptions = [...this.servicesOptions];

  //   // Update form
  //   this.settingsForm.patchValue({
  //     services: this.selectedServicesOptions,
  //   });

  //   console.log(
  //     'Canceled services:',
  //     this.selectedCancelOrDisableServiceOptions
  //   );
  //   console.log('Remaining services:', this.servicesOptions);

  //   // Clear selection
  //   this.selectedCancelOrDisableServiceOptions = [];
  // }

  saveSettings() {
    if (this.settingsForm.valid) {
      const formData = this.settingsForm.value;

      // Generate the complete settings object
      const branchSettings = {
        branchName: formData.branchName,
        branchAddress: formData.branchAddress,
        employeeCount: formData.employeeCount,
        counterCount: formData.counterCount,
        status: formData.status,
        workingHours: formData.workingHours,
        workingDays: formData.workingDays,
        services: formData.services,
        timestamp: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      // Here you would typically send this to your backend API
      console.log('Saving branch settings:', branchSettings);
      console.log('Form summary:', this.getFormSummary());

      this.workingHours = formData.workingHours;
      this.selectedDays = formData.workingDays;
      // this.selectedServicesOptions = formData.services;
      this.onSnackbarDismissed();

      this.navigateBack.emit();
      this.showsucess.emit();
    } else {
      Object.keys(this.settingsForm.controls).forEach((key) => {
        this.settingsForm.get(key)?.markAsTouched();
      });
      this.onSnackbarDismissed();

      // Mark all fields as touched to show validation errors
    }
  }

  cancelChanges() {
    // Reset form to original values
    this.settingsForm.reset();

    // Restore default values
    this.settingsForm.patchValue({
      workingHours: { start: '07:00', end: '15:00' },
      branchName: 'مدينة عيسى',
      branchAddress: 'Building 1088, Road 4625, Block 846, Isa Town',
      employeeCount: 24,
      counterCount: 15,
      status: 'completed',
      workingDays: this.defaultSelectedDays,
      services: ['1', '2'],
      newServiceName: '',
    });

    // Reset local properties
    this.selectedDays = [...this.defaultSelectedDays];
    // this.selectedServicesOptions = ['1', '2'];
    // this.selectedStatusOptions = ['1'];
    // this.selectedCancelOrDisableServiceOptions = [];

    console.log('Changes canceled, form reset to default values');

    // Navigate back to overview
    this.navigateBack.emit();
  }
}
