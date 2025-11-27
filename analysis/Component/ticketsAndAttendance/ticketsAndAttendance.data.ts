export interface TicketAndAttendanceOptionList {
  id: string;
  optionName: string;
  value?: string;
}

export const ticketsAndAttendanceReports: TicketAndAttendanceOptionList[] = [
  { id: '1', value: 'AllTicketReport', optionName: 'تقرير كل التذاكر ' },
  { id: '2', value: 'PrintedTicketReport', optionName: 'تقرير التذاكر المطبوعة' },
  { id: '3', value: 'UnPrintedTicketReport', optionName: 'تقرير التذاكر غير المطبوعة' },
];

export interface TicketAndAttendanceReport {
  id: string;
  personalNumber: string; // الرقم الشخصي
  appointmentDate: string; // تاريخ الموعد
  appointmentTime: string; // الوقت
  location: string; // الموقع
  branchId: string; // معرف الفرع
  branchName: string; // اسم الفرع
  ticketStatus: 'printed' | 'unprinted'; // حالة التذكرة
  userName: string; // اسم المستخدم
}

export const ticketsAndAttendanceReportData: TicketAndAttendanceReport[] = [
  {
    id: '1',
    personalNumber: '0209171234',
    appointmentDate: '28/08/2025',
    appointmentTime: '3:30 صباحاً',
    location: 'مدينة عيسى',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    ticketStatus: 'printed',
    userName: 'أحمد محمد'
  },
  {
    id: '2',
    personalNumber: '0301189876',
    appointmentDate: '29/08/2025',
    appointmentTime: '1:30 صباحاً',
    location: 'السعدين',
    branchId: '2',
    branchName: 'فرع المنامة',
    ticketStatus: 'unprinted',
    userName: 'فاطمة علي'
  },
  {
    id: '3',
    personalNumber: '0412195432',
    appointmentDate: '26/08/2025',
    appointmentTime: '2:30 صباحاً',
    location: 'مدينة عيسى، البحرين',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    ticketStatus: 'printed',
    userName: 'خالد أحمد'
  },
  {
    id: '4',
    personalNumber: '0523201098',
    appointmentDate: '30/08/2025',
    appointmentTime: '1:00 صباحاً',
    location: 'مدينة عيسى',
    branchId: '3',
    branchName: 'فرع الرفاع',
    ticketStatus: 'unprinted',
    userName: 'مريم سالم'
  },
  {
    id: '5',
    personalNumber: '0634207654',
    appointmentDate: '01/09/2025',
    appointmentTime: '11:30 صباحاً',
    location: 'الدعسون',
    branchId: '2',
    branchName: 'فرع المنامة',
    ticketStatus: 'printed',
    userName: 'سعد الكعبي'
  },
  {
    id: '6',
    personalNumber: '0745213210',
    appointmentDate: '26/08/2025',
    appointmentTime: '1:30 صباحاً',
    location: 'السعدين',
    branchId: '4',
    branchName: 'فرع المحرق',
    ticketStatus: 'unprinted',
    userName: 'نورا حسن'
  },
  {
    id: '7',
    personalNumber: '0856219876',
    appointmentDate: '02/09/2025',
    appointmentTime: '1:30 صباحاً',
    location: 'مدينة عيسى',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    ticketStatus: 'printed',
    userName: 'يوسف العلي'
  },
  {
    id: '8',
    personalNumber: '0967225432',
    appointmentDate: '03/09/2025',
    appointmentTime: '9:00 صباحاً',
    location: 'الحد',
    branchId: '3',
    branchName: 'فرع الرفاع',
    ticketStatus: 'unprinted',
    userName: 'زينب محمود'
  },
  {
    id: '9',
    personalNumber: '1078231098',
    appointmentDate: '04/09/2025',
    appointmentTime: '10:15 صباحاً',
    location: 'جدحفص',
    branchId: '2',
    branchName: 'فرع المنامة',
    ticketStatus: 'printed',
    userName: 'محمد الشيخ'
  },
  {
    id: '10',
    personalNumber: '1189237654',
    appointmentDate: '05/09/2025',
    appointmentTime: '2:45 مساءً',
    location: 'سترة',
    branchId: '4',
    branchName: 'فرع المحرق',
    ticketStatus: 'unprinted',
    userName: 'عائشة الزهراني'
  },
  {
    id: '11',
    personalNumber: '1290243210',
    appointmentDate: '06/09/2025',
    appointmentTime: '4:00 مساءً',
    location: 'الدعسون',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    ticketStatus: 'printed',
    userName: 'علي الخليفة'
  },
  {
    id: '12',
    personalNumber: '1301249876',
    appointmentDate: '07/09/2025',
    appointmentTime: '8:30 صباحاً',
    location: 'توبلي',
    branchId: '3',
    branchName: 'فرع الرفاع',
    ticketStatus: 'unprinted',
    userName: 'هدى البحراني'
  },
  {
    id: '13',
    personalNumber: '1412255432',
    appointmentDate: '08/09/2025',
    appointmentTime: '12:00 ظهراً',
    location: 'عالي',
    branchId: '2',
    branchName: 'فرع المنامة',
    ticketStatus: 'printed',
    userName: 'عبدالله الأنصاري'
  },
  {
    id: '14',
    personalNumber: '1523261098',
    appointmentDate: '09/09/2025',
    appointmentTime: '3:15 مساءً',
    location: 'الجفير',
    branchId: '4',
    branchName: 'فرع المحرق',
    ticketStatus: 'unprinted',
    userName: 'ليلى القطان'
  },
  {
    id: '15',
    personalNumber: '1634267654',
    appointmentDate: '10/09/2025',
    appointmentTime: '5:30 مساءً',
    location: 'البديع',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    ticketStatus: 'printed',
    userName: 'حمد السالم'
  }
];
