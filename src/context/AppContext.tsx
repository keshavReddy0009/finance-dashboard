import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, Role, Filters, NavPage, Period, ToastMessage } from '../types';
import { SEED_TRANSACTIONS } from '../data/seed';
import { monthKey, nowDate, exportToCSV } from '../utils/finance';

interface AppContextValue {
  // State
  transactions: Transaction[];
  role: Role;
  filters: Filters;
  currentPage: number;
  itemsPerPage: number;
  editingId: number | null;
  activePeriod: Period;
  currentNav: NavPage;
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  modalOpen: boolean;

  // Derived
  filteredTransactions: Transaction[];
  totalPages: number;
  pagedTransactions: Transaction[];
  summaryStats: SummaryStats;
  categories: string[];

  // Actions
  setRole: (role: Role) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  setActivePeriod: (period: Period) => void;
  navigate: (page: NavPage) => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (editId?: number | null) => void;
  closeModal: () => void;
  saveTransaction: (data: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: number) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: number) => void;
  doExportCSV: () => void;
}

export interface SummaryStats {
  balance: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  savingsRate: number;
  incomeChange: number;
  expenseChange: number;
}

const defaultFilters: Filters = { type: '', category: '', search: '', sort: 'date-desc' };

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('ff_transactions');
    return stored ? JSON.parse(stored) : SEED_TRANSACTIONS;
  });

  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('ff_role') as Role) || 'admin';
  });

  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePeriod, setActivePeriod] = useState<Period>('6m');
  const [currentNav, setCurrentNav] = useState<NavPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [nextId, setNextId] = useState(() => Math.max(...SEED_TRANSACTIONS.map((t) => t.id), 0) + 1);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ff_role', role);
  }, [role]);

  // Derived: categories list
  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  // Derived: filtered transactions
  const filteredTransactions = useMemo(() => {
    let txs = [...transactions];
    if (filters.type) txs = txs.filter((t) => t.type === filters.type);
    if (filters.category) txs = txs.filter((t) => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.sort === 'date-desc') txs.sort((a, b) => b.date.localeCompare(a.date));
    else if (filters.sort === 'date-asc') txs.sort((a, b) => a.date.localeCompare(b.date));
    else if (filters.sort === 'amount-desc') txs.sort((a, b) => b.amount - a.amount);
    else if (filters.sort === 'amount-asc') txs.sort((a, b) => a.amount - b.amount);
    return txs;
  }, [transactions, filters]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredTransactions.length / 10)), [filteredTransactions]);

  const pagedTransactions = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredTransactions.slice(start, start + 10);
  }, [filteredTransactions, currentPage]);

  // Summary stats
  const summaryStats = useMemo((): SummaryStats => {
    const thisMonth = monthKey(nowDate());
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonth = monthKey(lastMonthDate.toISOString());

    const thisInc = transactions.filter((t) => t.type === 'income' && monthKey(t.date) === thisMonth).reduce((s, t) => s + t.amount, 0);
    const thisExp = transactions.filter((t) => t.type === 'expense' && monthKey(t.date) === thisMonth).reduce((s, t) => s + t.amount, 0);
    const lastInc = transactions.filter((t) => t.type === 'income' && monthKey(t.date) === lastMonth).reduce((s, t) => s + t.amount, 0);
    const lastExp = transactions.filter((t) => t.type === 'expense' && monthKey(t.date) === lastMonth).reduce((s, t) => s + t.amount, 0);
    const balance = transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
    const savingsRate = thisInc > 0 ? Math.round(((thisInc - thisExp) / thisInc) * 100) : 0;
    const incomeChange = lastInc > 0 ? Math.round(((thisInc - lastInc) / lastInc) * 100) : 0;
    const expenseChange = lastExp > 0 ? Math.round(((thisExp - lastExp) / lastExp) * 100) : 0;

    return { balance, thisMonthIncome: thisInc, thisMonthExpenses: thisExp, savingsRate, incomeChange, expenseChange };
  }, [transactions]);

  // Actions
  const setRole = useCallback((r: Role) => setRoleState(r), []);

  const setFilters = useCallback((f: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    setCurrentPage(1);
  }, []);

  const navigate = useCallback((page: NavPage) => {
    setCurrentNav(page);
    setSidebarOpen(false);
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3300);
  }, []);

  const removeToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const openModal = useCallback((editId: number | null = null) => {
    setEditingId(editId);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
  }, []);

  const saveTransaction = useCallback(
    (data: Omit<Transaction, 'id'>) => {
      if (editingId !== null) {
        setTransactions((prev) => prev.map((t) => (t.id === editingId ? { ...data, id: editingId } : t)));
        addToast('Transaction updated successfully', 'success');
      } else {
        setTransactions((prev) => [...prev, { ...data, id: nextId }]);
        setNextId((n) => n + 1);
        addToast('Transaction added successfully', 'success');
      }
      closeModal();
    },
    [editingId, nextId, addToast, closeModal]
  );

  const deleteTransaction = useCallback(
    (id: number) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      addToast('Transaction deleted', 'success');
    },
    [addToast]
  );

  const doExportCSV = useCallback(() => {
    exportToCSV(transactions);
    addToast(`Exported ${transactions.length} transactions`, 'success');
  }, [transactions, addToast]);

  const value: AppContextValue = {
    transactions,
    role,
    filters,
    currentPage,
    itemsPerPage: 10,
    editingId,
    activePeriod,
    currentNav,
    sidebarOpen,
    toasts,
    modalOpen,
    filteredTransactions,
    totalPages,
    pagedTransactions,
    summaryStats,
    categories,
    setRole,
    setFilters,
    resetFilters,
    setCurrentPage,
    setActivePeriod,
    navigate,
    setSidebarOpen,
    openModal,
    closeModal,
    saveTransaction,
    deleteTransaction,
    addToast,
    removeToast,
    doExportCSV,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
