export type TransactionType = 'income' | 'expense';
export type Role = 'admin' | 'viewer';
export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
export type NavPage = 'dashboard' | 'transactions' | 'insights';
export type Period = '6m' | '12m';

export interface Transaction {
  id: number;
  date: string;       // YYYY-MM-DD
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
}

export interface Filters {
  type: string;
  category: string;
  search: string;
  sort: SortOption;
}

export interface AppState {
  transactions: Transaction[];
  role: Role;
  filters: Filters;
  currentPage: number;
  itemsPerPage: number;
  editingId: number | null;
  activePeriod: Period;
  nextId: number;
  currentNav: NavPage;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}
