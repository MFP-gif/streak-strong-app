// Date utilities using local time for consistent "today" logic
// Always use these helpers to avoid off-by-one errors around midnight

export const dateKey = (date: Date = new Date()): string => {
  // Use local time, not UTC
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isToday = (key: string): boolean => {
  return key === dateKey();
};

export const startOfWeek = (date: Date, weekStartsOn: number = 1): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const isSameWeek = (aKey: string, bKey: string, weekStartsOn: number = 1): boolean => {
  const dateA = new Date(aKey);
  const dateB = new Date(bKey);
  const startA = startOfWeek(dateA, weekStartsOn);
  const startB = startOfWeek(dateB, weekStartsOn);
  return startA.getTime() === startB.getTime();
};

export const rangeOfWeeks = (back: number): Array<[string, string]> => {
  const ranges: Array<[string, string]> = [];
  const now = new Date();
  
  for (let i = 0; i < back; i++) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const start = startOfWeek(weekStart);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    ranges.push([dateKey(start), dateKey(end)]);
  }
  
  return ranges;
};

export const daysBetweenKeys = (startKey: string, endKey: string): number => {
  const start = new Date(startKey);
  const end = new Date(endKey);
  
  // Set both to local midnight to get accurate day differences
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const getWeekDays = (endDate: Date = new Date(), count: number = 7): string[] => {
  const days: string[] = [];
  const start = startOfWeek(endDate);
  
  for (let i = 0; i < count; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    days.push(dateKey(date));
  }
  return days;
};