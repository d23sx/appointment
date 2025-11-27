
export interface Days {
  id: number;
  dayName: string;
}

export const DAYS_OPTIONS: Days[] = [
  {
    id: 1,
    dayName: "الأحد"
  },
  {
    id: 2,
    dayName: "الأثنين"
  },
  {
    id: 3,
    dayName: "الثلثاء"
  },
  {
    id: 4,
    dayName: "الأربعاء"
  },
  {
    id: 5,
    dayName: "الخميس"
  },
  {
    id: 6,
    dayName: "الجمعه"
  },
  {
    id: 7,
    dayName: "السبت"
  },
];
export const  StatusOptions = [
    { id: 'completed', optionName: 'مكتمل' },
    { id: 'cancelled', optionName: 'ملغي' },
];
