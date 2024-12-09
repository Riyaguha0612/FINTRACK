import React, { createContext, useState } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", amount: 0, date: "2024-11-01" },
    { id: 2, type: "expense", amount: 0, date: "2024-11-05" },
    { id: 3, type: "expense", amount: 0, date: "2024-11-10" },
    { id: 4, type: "income", amount: 0, date: "2024-11-15" },
    { id: 5, type: "expense", amount: 0, date: "2024-11-18" },
  ]);

  // Add a new transaction
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  // Context value to provide
  const contextValue = {
    transactions,
    addTransaction,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
