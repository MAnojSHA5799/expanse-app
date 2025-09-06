import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const ExpenseContext = createContext({ expenses: [], fetchExpenses: () => {} });

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses"); // change localhost to your IP if using mobile device
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addExpense = async (expense) => {
    try {
      const res = await axios.post("http://localhost:5000/api/expenses", expense);
      setExpenses([res.data, ...expenses]);
    } catch (err) {
      console.log(err);
    }
  };

  const editExpense = async (updatedExpense) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/expenses/${updatedExpense._id}`,
        updatedExpense
      );
      setExpenses(expenses.map(e => (e._id === res.data._id ? res.data : e)));
    } catch (err) {
      console.log(err);
    }
  };
  

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, fetchExpenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};
