export const today = () => new Date().toISOString().slice(0, 10);

export function dateLabel(date, options = { month: "short", day: "numeric" }) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, options);
}

export function daysBetween(from, to = today()) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (Number.isNaN(start.valueOf())) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

export function lastDays(count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}
