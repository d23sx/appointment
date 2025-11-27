import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ReuseableDataTable } from "../../../../shared/components/table/table";
import { CustomFilter, FilterOption, FilterPreset, TableAction, TableColumn, TableConfig } from "../../../../shared/components/table/table.interface";
import { IconConstant } from "../../../../shared/constants/icon-constants/icon-constant";

@Component({
  selector: 'app-branches-table',
  imports: [
    CommonModule,
    ReuseableDataTable
  ],
  templateUrl: './branches-table.html',
  styleUrls: ['./branches-table.css'],
  standalone: true
})
export class BranchesTable {
  @Output() editSignal = new EventEmitter();
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();

  // Sample branch data
  readonly branches = [
    {
      id: 'isa-town',
      name: 'مدينة عيسى',
      location: 'مدينة عيسى، البحرين',
      manager: 'أحمد محمد',
      status: 'active',
      openingHours: '8:00 - 17:00',
      region: 'central',
      capacity: 'high',
      openDate: '2020-01-15'
    },
    {
      id: 'muharraq',
      name: 'المحرق',
      location: 'المحرق، البحرين',
      manager: 'فاطمة علي',
      status: 'active',
      openingHours: '9:00 - 18:00',
      region: 'north',
      capacity: 'medium',
      openDate: '2021-05-20'
    },
    {
      id: 'port-salman',
      name: 'ميناء سلمان',
      location: 'ميناء سلمان، البحرين',
      manager: 'خالد عبدالله',
      status: 'inactive',
      openingHours: '8:30 - 16:30',
      region: 'south',
      capacity: 'low',
      openDate: '2022-11-10'
    }
  ];

  // Icons
  icons = {
    branch: IconConstant.BRANCH_MANAGEMENT,
    search: IconConstant.SEARCH,
    edit: IconConstant.EDIT,
    delete: IconConstant.DELETE,
    view: IconConstant.VIEW
  };

  // Table actions
  tableActions: TableAction[] = [
    {
      key: 'view',
      label: 'عرض',
      icon: this.icons.view,
      color: 'primary',
      onClick: (item) => this.onView(item)
    },
    {
      key: 'edit',
      label: 'تعديل',
      icon: this.icons.edit,
      color: 'warning',
      onClick: (item) => this.onEdit(item)
    },
    {
      key: 'delete',
      label: 'حذف',
      icon: this.icons.delete,
      color: 'error',
      onClick: (item) => this.onDelete(item)
    }
  ];

  // Table columns
  tableColumns: TableColumn[] = [
    {
      key: 'selected',
      label: '',
      type: 'checkbox',
      width: '40px',
      sortable: false
    },
    {
      key: 'name',
      label: 'اسم الفرع',
      type: 'text',
      sortable: true,
      searchable: true
    },
    {
      key: 'location',
      label: 'الموقع',
      type: 'text',
      sortable: true
    },
    {
      key: 'manager',
      label: 'مدير الفرع',
      type: 'text',
      sortable: true
    },
    {
      key: 'status',
      label: 'الحالة',
      type: 'status',
      sortable: true
    },
    {
      key: 'openingHours',
      label: 'ساعات العمل',
      type: 'text',
      sortable: true
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      type: 'actions',
      sortable: false,
      width: '120px'
    }
  ];

  // Table configuration
  tableConfig: TableConfig = {
    title: 'قائمة الفروع',
    showSearch: true,
    showFilters: true,
    showPagination: true,
    searchPlaceholder: 'البحث في اسم أو موقع الفرع...',
    pageSize: 10,
    filterLayout: 'horizontal' // Changed to horizontal for better space utilization
  };

  // Filter options
  filterOptions: { [key: string]: FilterOption[] } = {
    statuses: [
      { id: 'active', optionName: 'نشط' },
      { id: 'inactive', optionName: 'غير نشط' }
    ]
  };
  
  // Filter presets for quick filtering
  filterPresets = [
    {
      name: 'الفروع النشطة',
      filters: {
        status: ['active']
      }
    },
    {
      name: 'الفروع غير النشطة',
      filters: {
        status: ['inactive']
      }
    },
    {
      name: 'فروع المنطقة الوسطى',
      filters: {
        region: ['central']
      }
    }
  ];

  // Custom filters for region and capacity
  customFilters: CustomFilter[] = [
    {
      key: 'region',
      label: 'المنطقة',
      type: 'select',
      options: [
        { id: 'north', optionName: 'شمال' },
        { id: 'central', optionName: 'وسط' },
        { id: 'south', optionName: 'جنوب' }
      ],
      placeholder: 'اختر المنطقة',
      width: '180px' // Adjusted for horizontal layout
    },
    {
      key: 'capacity',
      label: 'السعة',
      type: 'select',
      options: [
        { id: 'high', optionName: 'عالية' },
        { id: 'medium', optionName: 'متوسطة' },
        { id: 'low', optionName: 'منخفضة' }
      ],
      placeholder: 'اختر السعة',
      width: '180px' // Adjusted for horizontal layout
    }
  ];

  constructor(private router: Router) {}

  // Action handlers
  onEdit(branch: any): void {
    this.editSignal.emit(branch);
    console.log('Edit branch:', branch);
  }

  onView(branch: any): void {
    this.actionClick.emit({ action: 'view', item: branch });
    this.router.navigate(['/branches/view', branch.id]);
  }

  onDelete(branch: any): void {
    if (confirm('هل تريد حذف هذا الفرع؟')) {
      console.log('Delete branch:', branch);
    }
  }

  // Handle bulk actions
  onBulkAction(event: { action: string; items: any[] }): void {
    const { action, items } = event;

    switch (action) {
      case 'delete':
        this.bulkDelete(items);
        break;
      case 'status-change':
        // Handle bulk status change if needed
        break;
    }
  }

  private bulkDelete(branches: any[]): void {
    if (confirm(`هل تريد حذف ${branches.length} فرع؟`)) {
      console.log('Bulk delete branches:', branches);
    }
  }
}
