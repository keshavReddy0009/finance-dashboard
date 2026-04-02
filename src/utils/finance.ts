export const fmt = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const fmtD = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const dateLabel = (d: string): string =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const monthKey = (d: string): string => d.substring(0, 7);

export const nowDate = (): string => new Date().toISOString().substring(0, 10);

export const pct = (a: number, b: number): number => (b === 0 ? 0 : Math.round((a / b) * 100));

export const dayName = (d: string): string =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });

export const monthName = (k: string): string => {
  const [y, m] = k.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getMonthRange = (period: '6m' | '12m'): string[] => {
  const months: string[] = [];
  const now = new Date();
  const n = period === '12m' ? 12 : 6;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().substring(0, 7));
  }
  return months;
};

export const exportToCSV = (transactions: { date: string; description: string; category: string; type: string; amount: number }[]): void => {
  const rows = [
    ['Date', 'Description', 'Category', 'Type', 'Amount'],
    ...transactions.map((t) => [t.date, t.description, t.category, t.type, String(t.amount)]),
  ];
  const csv = rows.map((r) => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'finflow-transactions.csv';
  a.click();
};
