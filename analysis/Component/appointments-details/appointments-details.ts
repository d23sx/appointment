import { Component } from '@angular/core';
import { data } from '../../../../app/data';
import { CardsContainer } from '../../../../shared/components/cards-container/cards-container';
import { CardAppointment } from '../../../../shared/components/card-appointment/card-appointment';
import { ReuseableDataTable } from '../../../../shared/components/table/table';
import { TableColumn, TableConfig, FilterOption } from '../../../../shared/components/table/table.interface';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';

@Component({
  selector: 'app-appointments-details',
  imports: [
    CardsContainer,
    CardAppointment,
    ReuseableDataTable,
  ],
  templateUrl: './appointments-details.html',
  styleUrl: './appointments-details.css',
})
export class AppointmentsDetails {
  onReciveEdit($event: any) {
    throw new Error('Method not implemented.');
  }

  list = data.OVERALL_DASHBOARD;

  // Client appointments data and configuration
  clientAppointmentsData = data.appoitmentTableNormal.data;

  clientTableColumns: TableColumn[] = [
    {
      key: 'cpr',
      label: 'الرقم الشخصي',
      type: 'text',
      sortable: true,
      searchable: true
    },
    {
      key: 'appointmentDate',
      label: 'تاريخ الموعد',
      type: 'date',
      sortable: true
    },
    {
      key: 'time',
      label: 'الوقت',
      type: 'text',
      sortable: true
    },
    {
      key: 'place',
      label: 'مكان',
      type: 'text',
      sortable: true
    }
  ];

  clientTableConfig: TableConfig = {
    title: 'جدول مواعيد العملاء',
    showSearch: true,
    showFilters: true,
    showPagination: true,
    searchPlaceholder: 'البحث في الرقم الشخصي، المكان...',
    pageSize: 10
  };

  // Agent appointments data and configuration
  agentAppointmentsData = data.appoitmentAgentTableNormal.data;

  agentTableColumns: TableColumn[] = [
    {
      key: 'cpr',
      label: 'الرقم الشخصي للمخلص',
      type: 'text',
      sortable: true,
      searchable: true
    },
    {
      key: 'clientCprs',
      label: 'الرقم الشخصي للعملاء',
      type: 'custom',
      customRenderer: 'clientCprs',
      sortable: false
    },
    {
      key: 'appointmentDate',
      label: 'تاريخ الموعد',
      type: 'date',
      sortable: true
    },
    {
      key: 'time',
      label: 'الوقت',
      type: 'text',
      sortable: true
    },
    {
      key: 'place',
      label: 'الموقع',
      type: 'text',
      sortable: true
    }
  ];

  agentTableConfig: TableConfig = {
    title: 'جدول مواعيد المخلصين',
    showSearch: true,
    showFilters: true,
    showPagination: true,
    searchPlaceholder: 'البحث في الرقم الشخصي، الموقع...',
    pageSize: 10
  };

  // Filter options for both tables
  filterOptions: { [key: string]: FilterOption[] } = {
    branches: [
      { id: 'محرق', optionName: 'محرق' },
      { id: 'مدينة عيسى', optionName: 'مدينة عيسى' },
      { id: 'ميناء سلمان', optionName: 'ميناء سلمان' }
    ]
  };

  // Icons
  icons = {
    appointment: IconConstant.CALENDAR
  };
}
