import { Component } from '@angular/core';
import { SectionName } from '../../../../shared/components/section-name/section-name';
import { CommonModule } from '@angular/common';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';
import { AddHolidayComponent } from './components/add-holiday/add-holiday.component';
import { EditHolidayComponent } from './components/edit-holiday/edit-holiday.component';
import { Holiday, holidays } from './branch-managment-holiday-data';
import { data } from '../../../../app/data';

@Component({
  selector: 'branch-managment-holiday',
  imports: [SectionName, CommonModule, CustomButton, AddHolidayComponent, EditHolidayComponent],
  templateUrl: './branch-managment-holiday.html',
  styleUrl: './branch-managment-holiday.css'
})

export class BranchManagmentHoliday {
  showAddForm = false;
  showEditForm = false; // Changed from showEditform to showEditForm for consistency
  selectedHoliday: any = null; // Property to store the holiday being edited

  edit = IconConstant.EDIT
  delete = IconConstant.DELETE

  holidays = holidays;
  branches = data.BRANCH_STATUS;

  trackById(index: number, holiday: Holiday): number {
    return holiday.id;
  }

  isPastHoliday(holiday: Holiday): boolean {
    let holidayDate: Date;

    // Handle different date structures
    if (holiday.isDateRange && holiday.endDate) {
      holidayDate = new Date(holiday.endDate);
    } else if (holiday.singleDate) {
      holidayDate = new Date(holiday.singleDate);
    } else {
      // Default to current date if no valid date found
      return false;
    }

    const today = new Date();

    // Reset time part of the dates for accurate comparison
    holidayDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return holidayDate < today;
  }

  onAddFormTrigger() {
    this.showAddForm = true;
  }

  hideAdd() {
    this.showAddForm = false;
  }

  getshowAddForm() {
    return this.showAddForm;
  }

  hideEdit() {
    this.showEditForm = false;
    this.selectedHoliday = null;
  }

  onUpdateHoliday(updatedHoliday: any) {
    console.log('Updated holiday:', updatedHoliday);

    // Find the index of the holiday being updated
    const index = this.holidays.findIndex(h => h.id === updatedHoliday.id);

    if (index !== -1) {
      // Replace the old holiday with the updated one
      this.holidays[index] = updatedHoliday;
    }

    // Hide the edit form
    this.hideEdit();
  }

  onAddHoliday(newHoliday: any) {
    console.log('New holiday received:', newHoliday);

    // Add the new holiday to the beginning of the array
    this.holidays.unshift({
      id: newHoliday.id || Date.now(),
      holidayName: newHoliday.holidayName,
      holidayDate: newHoliday.holidayDate,
      holidayDesc: newHoliday.holidayDesc,
      closedBranches: newHoliday.closedBranches,
      closedBranchDetails: newHoliday.closedBranchDetails,
      affectedBranchCount: newHoliday.affectedBranchCount,
      isDateRange: newHoliday.isDateRange,
      singleDate: newHoliday.singleDate,
      startDate: newHoliday.startDate,
      endDate: newHoliday.endDate,
    });
  }

  onEditHoliday(holiday: any) {
    console.log('Editing holiday:', holiday);

    // Store the selected holiday for editing
    this.selectedHoliday = {...holiday};

    // Show the edit form
    this.showEditForm = true;
  }

  onDeleteHoliday(holidayId: number) {
    console.log('Deleting holiday with ID:', holidayId);

    // For now we'll use the basic confirm, but in a real app, you might want to use a custom dialog component
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الإجازة؟')) {
      // Filter out the holiday with the given ID
      this.holidays = this.holidays.filter(holiday => holiday.id !== holidayId);

      // You might also want to call an API to delete the holiday from the backend
      // this.holidayService.deleteHoliday(holidayId).subscribe(...);
    }
  }

  // Helper method to format dates consistently
  private formatDate(date: Date | null): string {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
