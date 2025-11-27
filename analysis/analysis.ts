import { Component, ViewChild } from '@angular/core';
import {
  HeaderTab,
  TabItem,
} from '../../shared/components/header-tab/header-tab';
import { IconConstant } from '../../shared/constants/icon-constants/icon-constant';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Overveiw } from './Component/overveiw/overveiw';
import { data } from '../../app/data';
import { SectionName } from '../../shared/components/section-name/section-name';
import {
  DatePickerComponent,
  DateRange,
} from '../../shared/components/date-picker/date-picker.component';
import { FormCard } from '../../shared/form/form-card/form-card';
import { AppointmentsDetails } from "./Component/appointments-details/appointments-details";
import { PeriodsReport } from '../periods-report/periods-report';
import { OverallAnalysis } from '../overall-analysis/overall-analysis';
import { TicketsAndAttendance } from './Component/ticketsAndAttendance/ticketsAndAttendance';
import { FormsModule } from '@angular/forms';
import { ApiService, ExportRequest } from '../../services/api/api.service';
import { FileDownloadService } from '../../services/file/file-download.service';
@Component({
  selector: 'app-analysis',
  imports: [
    HeaderTab,
    Overveiw,
    SectionName,
    DatePickerComponent,
    FormCard,
    FormsModule,
    AppointmentsDetails,
    PeriodsReport,
    OverallAnalysis,
    TicketsAndAttendance,
    CommonModule,
    HttpClientModule
],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css',
})
export class Analysis {
  @ViewChild(TicketsAndAttendance) ticketsComponent!: TicketsAndAttendance;
  @ViewChild(AppointmentsDetails) appointmentsComponent!: AppointmentsDetails;
  @ViewChild(Overveiw) overviewComponent!: Overveiw;

  list = data.analysisCard;
  [x: string]: any;
  activeTab: string = 'viewAll';
  showexport = false;
  isExporting = false;

  branchs = data.BRANCH_STATUS;

  branchOptions = this.branchs.map((branch) => ({
    label: branch.branchName,
    value: branch.id,
  }));

  name = this.branchOptions[0].value;

  tabs: TabItem[] = [
    { id: 'viewAll', label: 'نظرة عامة' },
    { id: 'Appointments', label: 'المواعيد' },
    { id: 'viewPeriodReport', label: ' تقرير الفترات ' },
    { id: 'viewTicketsAttendance', label: 'التذاكر والحضور' },
    { id: 'viewOverallAnalysis', label: ' التقارير الإحصائية' },
  ];

  time = IconConstant.ANALYSIS;
  array = ['hth', 'hrftgyh', 'yhrtyh'];

  filtterDate: DateRange = { start: null, end: null };

  constructor(
    private apiService: ApiService,
    private fileDownloadService: FileDownloadService
  ) {}

  onTabChanged(tabId: string) {
    this.activeTab = tabId;
    console.log('Active tab changed to:', tabId);
  }

  chosenDate(event: DateRange) {
    this.filtterDate = event;
    console.log('hi' + this.filtterDate.end);
  }

  showExport() {
    this.showexport = true;
  }

  date: any;
  setdate(date: any) {
    this.date = date;
  }

  print(event: any) {
    event.preventDefault();
    this.exportData();
  }

  private exportData(): void {
    // Validate date range
    if (!this.date || !this.date.start || !this.date.end) {
      alert('يرجى تحديد تاريخ البداية والنهاية');
      return;
    }

    // Validate branch selection
    if (!this.name) {
      alert('يرجى اختيار الفرع');
      return;
    }

    console.log('Starting export with:');
    console.log('- Branch:', this.name);
    console.log('- Date range:', this.date);
    console.log('- Active tab:', this.activeTab);

    this.isExporting = true;

    // Get current component filters and state
    const currentFilters = this.getCurrentComponentFilters();

    const exportRequest: ExportRequest = {
      branchId: this.name,
      startDate: this.formatDate(this.date.start),
      endDate: this.formatDate(this.date.end),
      tabType: this.activeTab,
      filters: currentFilters
    };

    console.log('Export request:', exportRequest);

    this.apiService.exportToCsv(exportRequest).subscribe({
      next: (blob: Blob) => {
        if (!blob || blob.size === 0) {
          console.error('خطأ: البيانات المستلمة فارغة');
          alert('لا توجد بيانات للتصدير');
          this.isExporting = false;
          return;
        }

        const selectedBranch = this.branchOptions.find(b => b.value === Number(this.name));
        const branchName = selectedBranch ? selectedBranch.label : 'branch';
        
        console.log('Selected branch ID:', this.name);
        console.log('Selected branch object:', selectedBranch);
        console.log('Branch name for filename:', branchName);
        
        const filename = this.fileDownloadService.getArabicFilename(this.activeTab, branchName);

        this.fileDownloadService.downloadBlob(blob, filename);
        this.showexport = false;
        this.isExporting = false;

        console.log('تم تصدير التقرير بنجاح');
      },
      error: (error) => {
        console.error('خطأ في تصدير التقرير:', error);

        // Provide more detailed error messages
        let errorMessage = 'حدث خطأ أثناء تصدير التقرير.';

        if (error.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي (Backend).';
        } else if (error.status === 404) {
          errorMessage = 'نقطة النهاية غير موجودة. تحقق من عنوان API.';
        } else if (error.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
        } else if (error.error instanceof Blob) {
          // Try to read error message from blob
          const reader = new FileReader();
          reader.onload = () => {
            console.error('Server error message:', reader.result);
          };
          reader.readAsText(error.error);
        }

        alert(errorMessage);
        this.isExporting = false;
      }
    });
  }

  private getCurrentComponentFilters(): any {
    const filters: any = {
      selectedBranch: this.name
    };

    try {
      switch (this.activeTab) {
        case 'viewAll':
          // Overview tab - no specific filters needed, backend will get overview data
          filters.includeCards = true;
          filters.includeBranchStatus = true;
          break;

        case 'Appointments':
          // Appointments tab - could include search terms, status filters, etc.
          filters.includeClientAppointments = true;
          filters.includeAgentAppointments = true;

          // Only access component properties if component is defined
          if (this.appointmentsComponent) {
            // Add any search or filter terms from the component if available
          }
          break;

        case 'viewPeriodReport':
          // Periods report tab
          filters.includePeriodData = true;
          break;

        case 'viewTicketsAttendance':
          // Tickets and attendance tab
          filters.includeTicketSummary = true;

          // Only access component properties if component is defined
          if (this.ticketsComponent) {
            if (this.ticketsComponent.selectedBranchId) {
              filters.selectedBranchId = this.ticketsComponent.selectedBranchId;
            }
            if (this.ticketsComponent.selectedReportId) {
              filters.selectedReportId = this.ticketsComponent.selectedReportId;
            }
            if (this.ticketsComponent.selectedDateRange) {
              filters.selectedDateRange = this.ticketsComponent.selectedDateRange;
            }
          }
          break;

        case 'viewOverallAnalysis':
          // Overall analysis tab
          filters.includeStatistics = true;
          filters.includeComparison = true;
          break;

        default:
          break;
      }
    } catch (error) {
      console.warn('Error getting component filters:', error);
    }

    return filters;
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }
}
