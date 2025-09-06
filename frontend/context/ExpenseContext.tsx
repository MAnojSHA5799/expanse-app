// import React, { createContext, useContext, useState } from "react";
// import { Expense } from "../types";

// type ExpenseContextType = {
//   expenses: Expense[];
//   addExpense: (expense: Omit<Expense, "id">) => void;
//   editExpense: (updated: Expense) => void;
//   deleteExpense: (id: string) => void;
// };

// const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// export function ExpenseProvider({ children }: { children: React.ReactNode }) {
//   const [expenses, setExpenses] = useState<Expense[]>([]);

//   const addExpense = (expense: Omit<Expense, "id">) => {
//     const newExpense = { ...expense, id: Date.now().toString() };
//     setExpenses((prev) => [...prev, newExpense]);
//   };

//   const editExpense = (updated: Expense) => {
//     setExpenses((prev) =>
//       prev.map((exp) => (exp.id === updated.id ? updated : exp))
//     );
//   };

//   const deleteExpense = (id: string) => {
//     setExpenses((prev) => prev.filter((exp) => exp.id !== id));
//   };

//   return (
//     <ExpenseContext.Provider
//       value={{ expenses, addExpense, editExpense, deleteExpense }}
//     >
//       {children}
//     </ExpenseContext.Provider>
//   );
// }

// export function useExpenses() {
//   const ctx = useContext(ExpenseContext);
//   if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
//   return ctx;
// }



import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import type { Expense } from "../types";

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
};
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const API_URL = "http://192.168.29.58:4000/api/expenses";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log("Fetched expenses:", res.data);
        setExpenses(res.data); 
      })
      .catch((err) => console.error("Error fetching expenses:", err.message));
  }, []);
  

  const addExpense = async (expense: Omit<Expense, "id">) => {
    console.log("Adding expense:", expense);
    try {
      const res = await axios.post(API_URL, expense, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Expense added (backend response):", res.data);
      setExpenses([res.data, ...expenses]);
    } catch (err: any) {
      console.error("Error adding expense:", err.message);
    }
  };
  

  const editExpense = async (expense: Expense) => {
    try {
      const res = await axios.put(`${API_URL}/${expense.id}`, expense);
      setExpenses(expenses.map((e) => (e.id === expense.id ? res.data : e)));
    } catch (err: any) {
      console.error("Error editing expense:", err.message);
    }
  };
  
 
  const deleteExpense = async (id: string) => {
    console.log("Delete request for ID:", id);
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      console.log("Backend response (delete):", res.data);
      setExpenses(expenses.filter((e) => e.id !== id));  
    } catch (err: any) {
      console.error("Error deleting expense:", err.response?.data || err.message);
    }
  };
  
  

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, editExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpenses must be used inside ExpenseProvider");
  return context;
};


