
export interface Holiday {
  id: number;
  holidayName: string;
  holidayDate: Date | { start: Date, end: Date };
  holidayDesc?: string;
  closedBranches?: string[];
  closedBranchDetails?: any[];
  affectedBranchCount?: number;
  isDateRange?: boolean;
  singleDate?: Date;
  startDate?: Date;
  endDate?: Date;
}
export const holidays: Holiday[] = [
    {
      id: 1,
      holidayName: 'اجازة رأس السنة',
      holidayDate: new Date('2026-01-01'),
      singleDate: new Date('2026-01-01'),
      isDateRange: false,
    },
    {
      id: 2,
      holidayName: 'اجازة اليوم الوطني',
      holidayDate: new Date('2026-12-17'),
      singleDate: new Date('2026-12-17'),
    },
    {
      id: 3,
      holidayName: 'اجازة رأس السنة',
      holidayDate: new Date('2025-01-01'),
      singleDate: new Date('2025-01-01'),
      isDateRange: false,
    },
    {
      id: 4,
      holidayName: 'اجازة عاشوراء',
      holidayDate: new Date('2025-01-01'),
      singleDate: new Date('2025-01-01'),
      isDateRange: false,
    }
  ];
