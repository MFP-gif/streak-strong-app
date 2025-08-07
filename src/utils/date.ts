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
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    days.push(dateKey(date));
  }
  return days;
};