export const dateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (date: string, amount: number) => {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + amount);
  return dateKey(next);
};

export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, options);

export const dayDifference = (from: string, to = dateKey()) => {
  const start = new Date(`${from}T12:00:00`).getTime();
  const end = new Date(`${to}T12:00:00`).getTime();
  return Number.isFinite(start) ? Math.max(0, Math.round((end - start) / 86_400_000)) : 0;
};

export const lastNDates = (count: number, through = dateKey()) =>
  Array.from({ length: count }, (_, index) => addDays(through, index - count + 1));

