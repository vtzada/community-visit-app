export function getNextTuesdays(count: number, startFrom: Date = new Date()): Date[] {
  const date = new Date(startFrom);
  date.setHours(0, 0, 0, 0);

  while (date.getDay() !== 2) {
    date.setDate(date.getDate() + 1);
  }

  const result: Date[] = [];
  for (let i = 0; i < count; i++) {
    result.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }
  return result;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date | null {
  const parts = iso.split('-');
  if (parts.length !== 3) return null;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(date.getTime()) ? null : date;
}

export function formatFriendlyDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}