import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ReuseableDataTable } from "../../../../shared/components/table/table";
import { CustomFilter, FilterOption, TableAction, TableColumn, TableConfig } from "../../../../shared/components/table/table.interface";
import { IconConstant } from "../../../../shared/constants/icon-constants/icon-constant";

@Component({
  selector: 'app-employees-table',
  imports: [
    CommonModule,
    ReuseableDataTable
  ],
  templateUrl: './employees-table.html',
  styleUrls: ['./employees-table.css'],
  standalone: true
})
export class EmployeesTable {
  @Output() editSignal = new EventEmitter();
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();

  // Sample employee data
  readonly employees = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '123456789',
      role: 'admin',
      status: 'active',
      joinDate: '2022-05-15',
      branch: 'isa-town'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      phone: '987654321',
      role: 'manager',
      status: 'active',
      joinDate: '2023-01-20',
      branch: 'muharraq'
    },
    {
      id: 3,
      name: 'خالد عبدالله',
      email: 'khaled@example.com',
      phone: '456789123',
      role: 'staff',
      status: 'inactive',
      joinDate: '2021-08-10',
      branch: 'port-salman'
    },
    {
      id: 4,
      name: 'نورة أحمد',
      email: 'noura@example.com',
      phone: '111222333',
      role: 'staff',
      status: 'active',
      joinDate: '2023-03-05',
      branch: 'isa-town'
    },
    {
      id: 5,
      name: 'محمد علي',
      email: 'mohammed@example.com',
      phone: '444555666',
      role: 'manager',
      status: 'active',
      joinDate: '2022-10-15',
      branch: 'muharraq'
    }
  ];
  
  // Filtered employees (for search)
  filteredEmployees = [...this.employees];

  // Icons
  icons = {
    users: IconConstant.USERS,
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
      label: 'الاسم',
      type: 'text',
      sortable: true,
      searchable: true
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      type: 'text',
      sortable: true
    },
    {
      key: 'phone',
      label: 'رقم الهاتف',
      type: 'text',
      sortable: true
    },
    {
      key: 'role',
      label: 'الدور الوظيفي',
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
      key: 'actions',
      label: 'الإجراءات',
      type: 'actions',
      sortable: false,
      width: '120px'
    }
  ];

  // Table configuration
  tableConfig: TableConfig = {
    title: 'قائمة الموظفين',
    showSearch: true,
    showFilters: true,
    showPagination: true,
    searchPlaceholder: 'البحث في الاسم أو البريد الإلكتروني...',
    pageSize: 10,
    filterLayout: 'horizontal' // New property for filter layout
  };

  // Filter options
  filterOptions: { [key: string]: FilterOption[] } = {
    statuses: [
      { id: 'active', optionName: 'نشط' },
      { id: 'inactive', optionName: 'غير نشط' }
    ]
  };

  // Custom filters for role
  customFilters: CustomFilter[] = [
    {
      key: 'role',
      label: 'الدور الوظيفي',
      type: 'multiselect',
      options: [
        { id: 'admin', optionName: 'مدير النظام' },
        { id: 'manager', optionName: 'مدير' },
        { id: 'staff', optionName: 'موظف' }
      ],
      placeholder: 'اختر الدور',
      selectedValues: []
    }
  ];

  constructor(private router: Router) {}

  // Action handlers
  onEdit(employee: any): void {
    this.editSignal.emit(employee);
    console.log('Edit employee:', employee);
  }

  onView(employee: any): void {
    this.actionClick.emit({ action: 'view', item: employee });
    this.router.navigate(['/users/view', employee.id]);
  }

  onDelete(employee: any): void {
    if (confirm('هل تريد حذف هذا الموظف؟')) {
      console.log('Delete employee:', employee);
    }
  }
  
  // Custom search handler
  onEmployeeSearch(searchTerm: string): void {
    console.log('Searching for:', searchTerm);
    
    // You can implement custom search logic here if needed
    // For now we'll let the table component handle the filtering
  }
  
  // Custom filter function for employee search
  employeeFilter = (employee: any, term: string): boolean => {
    if (!term || term.trim() === '') return true;
    
    const searchTerm = term.toLowerCase();
    
    // Search in multiple fields with priority weighting
    return (
      employee.name?.toLowerCase().includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm) ||
      employee.phone?.includes(searchTerm) ||
      employee.role?.toLowerCase().includes(searchTerm) ||
      employee.branch?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Handle search cleared
  onSearchCleared(): void {
    console.log('Search cleared');
    this.filteredEmployees = [...this.employees];
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

  private bulkDelete(employees: any[]): void {
    if (confirm(`هل تريد حذف ${employees.length} موظف؟`)) {
      console.log('Bulk delete employees:', employees);
    }
  }
}
