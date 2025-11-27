import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionName } from '../../shared/components/section-name/section-name';
import { HeaderTab } from '../../shared/components/header-tab/header-tab';
import { IconConstant } from '../../shared/constants/icon-constants/icon-constant';
import { BranchManagmentOverAll } from './components/branch-managment-over-all/branch-managment-over-all';
import { BranchManagmentHoliday } from './components/branch-managment-holiday/branch-managment-holiday';
import { BranchManagmentSettings } from './components/branch-managment-settings/branch-managment-settings';
import { AddBranch } from './components/add-branch/add-branch';
import {
  SnackbarAlertComponent,
  SnackbarType,
} from '../../shared/components/snackbar-alert/snackbar-alert.component';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number;
}
@Component({
  selector: 'app-branch-managment',
  imports: [
    CommonModule,
    SectionName,
    HeaderTab,
    BranchManagmentOverAll,
    BranchManagmentSettings,
    BranchManagmentHoliday,
    AddBranch,
    SnackbarAlertComponent,
  ],
  templateUrl: './branch-managment.html',
  styleUrl: './branch-managment.css',
})
export class BranchManagment {
  plus = IconConstant.DIAMOND_PLUS;
  activeTab: string = 'viewAll';
  addBranchForm = false;
  selectedBranch: any = null;

  snackbarMessage3: string = ' تم إضافة فر ع بنجاح';
  snackbarType3: SnackbarType = 'success';
  showSnackbar3: boolean = false;

  tabs: TabItem[] = [
    { id: 'viewAll', label: 'نظرة عامة' },
    { id: 'viewSettings', label: 'الاعدادات' },
    { id: 'viewVacation', label: 'الإجازات' },
  ];

  onTabChanged(tabId: string) {
    this.activeTab = tabId;
    console.log('Active tab changed to:', tabId);
  }

  add() {
    console.log('Add branch...');
    this.addBranchForm = true;
  }

  onNavigateToSettings(branchData: any) {
    this.selectedBranch = branchData;
    this.activeTab = 'viewSettings';
    console.log('Navigating to settings for branch:', branchData);
  }

  onNavigateBack() {
    this.activeTab = 'viewAll';
    this.selectedBranch = null;
    console.log('Navigating back to overview');
  }

  showSucessmessage() {
    this.showSnackbar3 = true;
    setInterval(() => {
      this.showSnackbar3 = false;
    }, 5000);
  }
}
