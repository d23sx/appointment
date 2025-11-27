import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';
import { ToggleSwitch } from '../../../../shared/components/toggle-switch/toggle-switch';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import { LucideAngularModule } from 'lucide-angular';

export interface BranchManagmentOverAllProps {
  branchId? : string;
  branchName? : string;
  date? : string;
  status? : string | 'active' | 'inactive' ;
  address? : string;
  totalAppointmentCount? : number;
  completedCount? : number;
  canceledCount? : number;
  workingHours? : string;
  waitTime? : string;
  inactiveDesc? : string;
}

@Component({
  selector: 'branch-managment-over-all',
  imports: [CommonModule, ToggleSwitch, CustomButton, LucideAngularModule],
  templateUrl: './branch-managment-over-all.html',
  styleUrl: './branch-managment-over-all.css'
})


export class BranchManagmentOverAll {

  location = IconConstant.LOCATION;
  warning = IconConstant.WARNING;
  user = IconConstant.USERS;
  time = IconConstant.TIME;
  inactive = IconConstant.INACTIVE;
  watching = IconConstant.CLOCK;
  viewWhite = IconConstant.VIEW;
  settingPrimary = IconConstant.SETTINGS;
  users = IconConstant.USERS;

  @Output() navigateToSettings = new EventEmitter<BranchManagmentOverAllProps>();


  @Input() props: BranchManagmentOverAllProps[] = [{
    branchId: '1',
    branchName: 'مدينة عيسى',
    date: '1/9/2025 11:00 AM',
    status: 'active',
    address: 'Building 1088, Road 4025, Block 840, Isa Town',
    totalAppointmentCount: 75,
    completedCount: 43,
    canceledCount: 3,
    workingHours: '7 - 5',
    waitTime: '15 mins',
    inactiveDesc: '',
  },
  {
    branchId: '2',
    branchName: 'المحرق',
    date: '1/9/2025 11:00 AM',
    status: 'active',
    address: 'Muharraq, Seef Mall',
    totalAppointmentCount: 75,
    completedCount: 43,
    canceledCount: 3,
    workingHours: '7 - 5',
    waitTime: '15 mins',
    inactiveDesc: '',
  },
  {
    branchId: '3',
    branchName: 'ميناء سلمان',
    date: '1/9/2025 11:00 AM',
    status: 'inactive',
    address: 'Building 114, Road 4304, Block 343, Mina Salman',
    totalAppointmentCount: 75,
    completedCount: 43,
    canceledCount: 3,
    workingHours: '7 - 5',
    waitTime: '15 mins',
    inactiveDesc: 'الفرع مغلق مؤقتا',
  }
];

  trackBybranchId(index: number, item: any): any {
    return item.branchId;
  }

  onToggleChange(prop: BranchManagmentOverAllProps, isActive: boolean) {
    prop.status = isActive ? 'active' : 'inactive';
    prop.inactiveDesc = isActive ? '' : 'الفرع مغلق مؤقتا';
  }

  onSettingsClick(branch: BranchManagmentOverAllProps) {
    this.navigateToSettings.emit(branch);
  }
}
