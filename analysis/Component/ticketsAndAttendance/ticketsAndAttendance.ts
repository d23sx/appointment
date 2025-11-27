import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { data } from '../../../../app/data';
import { TicketCard } from '../../../../shared/components/ticket-card/ticket-card';
import { DatePickerComponent, DateRange } from '../../../../shared/components/date-picker/date-picker.component';
import { SelectList } from '../../../../shared/components/select-list/select-list';
import { ReuseableDataTable } from '../../../../shared/components/table/table';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import { ticketsAndAttendanceReportData, ticketsAndAttendanceReports, TicketAndAttendanceReport } from './ticketsAndAttendance.data';
import { TableColumn, TableConfig } from '../../../../shared/components/table/table.interface';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';

@Component({
  selector: 'tickets-attendance',
  templateUrl: './ticketsAndAttendance.html',
  styleUrls: ['./ticketsAndAttendance.css'],
  imports: [CommonModule,
    TicketCard,
    DatePickerComponent,
    SelectList,
    ReuseableDataTable,
    CustomButton
  ],
})
export class TicketsAndAttendance implements OnInit {
  tickets = data.TicketAttendanceCard;
  branches = data.BRANCH_STATUS.map(branch => ({ id: branch.id.toString(), optionName: branch.branchName }));
  report = ticketsAndAttendanceReports;

  selectedBranchId: string | null = null;
  selectedReportId: string | null = null;
  selectedDateRange: DateRange | null = null;
  showTable: boolean = false;

  // All data and filtered data
  allTableData = ticketsAndAttendanceReportData;
  tableData: TicketAndAttendanceReport[] = [];

  ticket = IconConstant.TICKET;

  // Table configuration for simple layout with pagination
  tableConfig: TableConfig = {
    title: 'تقرير التذاكر والحضور',
    showFilters: false,
    showSearch: true,
    showPagination: true,
    showSelectAll: false,
    pageSize: 10,
    searchPlaceholder: 'ابحث عن طريق الرقم الشخصي أو اسم المستخدم'
  };

  tableColumns: TableColumn[] = [
    {
      key: 'personalNumber',
      label: 'الرقم الشخصي',
      type: 'text',
      sortable: true,
      width: 'auto'
    },
    {
      key: 'userName',
      label: 'اسم المستخدم',
      type: 'text',
      sortable: true,
      width: 'auto'
    },
    {
      key: 'appointmentDate',
      label: 'تاريخ الموعد',
      type: 'text',
      sortable: true,
      width: 'auto'
    },
    {
      key: 'appointmentTime',
      label: 'الوقت',
      type: 'text',
      sortable: true,
      width: 'auto'
    },
    {
      key: 'location',
      label: 'الفرع',
      type: 'text',
      sortable: true,
      width: 'auto'
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  // Check if any filters are applied
  get hasFiltersApplied(): boolean {
    return !!(this.selectedBranchId || this.selectedReportId || this.selectedDateRange);
  }

  // Get button text based on filter state
  get buttonText(): string {
    return this.hasFiltersApplied && this.showTable ? 'إعادة ضبط' : 'عرض';
  }

  // Get button type based on filter state
  get buttonType(): string {
    return this.hasFiltersApplied && this.showTable ? 'reset' : 'submit';
  }
  // Get button type based on filter state
  get buttonVarient(): string {
    return this.hasFiltersApplied && this.showTable ? 'secondary' : 'primary';
  }

  onBranchChange(event: { id: string; optionName: string }) {
    console.log('Selected branch:', event);
    this.selectedBranchId = event.id;
  }

  onReportChange(event: { id: string; optionName: string }) {
    console.log('Selected report:', event);
    this.selectedReportId = event.id;
  }

  onDateRangeChange(dateRange: DateRange) {
    console.log('Selected date range:', dateRange);
    this.selectedDateRange = dateRange;
  }

  onShowReport() {
    if (this.hasFiltersApplied && this.showTable) {
      // Reset filters
      this.resetFilters();
    } else {
      // Apply filters and show report
      this.filterTableData();
      this.showTable = true;
    }
  }

  private resetFilters() {
    this.selectedBranchId = null;
    this.selectedReportId = null;
    this.selectedDateRange = null;
    this.showTable = false;
    this.tableData = [];

    // Reset form controls (you might need to emit events to child components)
    console.log('Filters reset');
  }

  private filterTableData() {
    let filteredData = [...this.allTableData];

    // Filter by branch
    if (this.selectedBranchId && this.selectedBranchId !== '') {
      filteredData = filteredData.filter(item => item.branchId === this.selectedBranchId);
    }

    // Filter by report type (ticket status)
    if (this.selectedReportId && this.selectedReportId !== '') {
      const selectedReport = this.report.find(r => r.id === this.selectedReportId);
      if (selectedReport) {
        switch (selectedReport.value) {
          case 'PrintedTicketReport':
            filteredData = filteredData.filter(item => item.ticketStatus === 'printed');
            break;
          case 'UnPrintedTicketReport':
            filteredData = filteredData.filter(item => item.ticketStatus === 'unprinted');
            break;
          case 'AllTicketReport':
            // No additional filtering needed for all tickets
            break;
        }
      }
    }

    // Filter by date range
    if (this.selectedDateRange && (this.selectedDateRange.start || this.selectedDateRange.end)) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.appointmentDate.split('/').reverse().join('-'));

        let matchesFromDate = true;
        let matchesToDate = true;

        if (this.selectedDateRange?.start) {
          matchesFromDate = itemDate >= this.selectedDateRange.start;
        }

        if (this.selectedDateRange?.end) {
          matchesToDate = itemDate <= this.selectedDateRange.end;
        }

        return matchesFromDate && matchesToDate;
      });
    }

    this.tableData = filteredData;
    console.log('Filtered data:', this.tableData);
  }

  // Table event handlers
  onTableSearchChange(searchTerm: string) {
    console.log('Search term changed:', searchTerm);
  }

  onTablePageChange(page: number) {
    console.log('Page changed to:', page);
  }

  onTableExportRequest(format: string) {
    console.log('Export requested:', format);
  }
}
