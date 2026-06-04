import React, { createContext, ReactNode, useContext, useState } from 'react';
import { format } from 'date-fns';

type ExpenseDateContextValue = {
  selectedExpenseDate: string;
  setSelectedExpenseDate: (date: string) => void;
};

const ExpenseDateContext = createContext<ExpenseDateContextValue | undefined>(
  undefined,
);

export const ExpenseDateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedExpenseDate, setSelectedExpenseDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );

  return (
    <ExpenseDateContext.Provider
      value={{ selectedExpenseDate, setSelectedExpenseDate }}
    >
      {children}
    </ExpenseDateContext.Provider>
  );
};

export const useExpenseDate = () => {
  const context = useContext(ExpenseDateContext);

  if (!context) {
    throw new Error('useExpenseDate must be used within ExpenseDateProvider');
  }

  return context;
};
