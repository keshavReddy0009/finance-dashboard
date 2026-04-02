import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { nowDate } from '../utils/finance';
import { ALL_CATEGORIES } from '../data/seed';
import { TransactionType } from '../types';

const TransactionModal: React.FC = () => {
  const { modalOpen, closeModal, editingId, transactions, saveTransaction, addToast } = useApp();

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(nowDate());
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    if (modalOpen) {
      if (editingId !== null) {
        const tx = transactions.find((t) => t.id === editingId);
        if (tx) {
          setDesc(tx.description);
          setAmount(String(tx.amount));
          setDate(tx.date);
          setType(tx.type);
          setCategory(tx.category);
        }
      } else {
        setDesc('');
        setAmount('');
        setDate(nowDate());
        setType('expense');
        setCategory('Food');
      }
    }
  }, [modalOpen, editingId, transactions]);

  const handleSave = () => {
    const amountNum = parseFloat(amount);
    if (!desc.trim() || !amount || !date || isNaN(amountNum) || amountNum <= 0) {
      addToast('Please fill all fields correctly', 'error');
      return;
    }
    saveTransaction({ description: desc.trim(), amount: amountNum, date, type, category });
  };

  return (
    <div
      className={`modal-overlay${modalOpen ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="modal">
        <div className="modal-title">
          {editingId !== null ? 'Edit Transaction' : 'Add Transaction'}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Groceries at Whole Foods"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {editingId !== null ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
