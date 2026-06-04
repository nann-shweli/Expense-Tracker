import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const expensesCollection = firestore().collection('expenses');

export interface ExpenseData {
  id?: string;
  amount: number;
  description: string;
  category: string;
  date: any;
  userId: string;
  createdAt: any;
  createdAtClient?: number;
  hasPendingWrites?: boolean;
  snapshotOrder?: number;
}

const toDate = (value: any) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value.toDate === 'function') {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value.toMillis === 'function') {
    const date = new Date(value.toMillis());
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const seconds = value.seconds ?? value._seconds;
  const nanoseconds = value.nanoseconds ?? value._nanoseconds ?? 0;

  if (typeof seconds === 'number') {
    const date = new Date(seconds * 1000 + Math.floor(nanoseconds / 1000000));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getExpenseDate = (expense: Pick<ExpenseData, 'date'>) => {
  return toDate(expense.date);
};

export const getExpenseCreatedDate = (
  expense: Pick<ExpenseData, 'createdAt' | 'createdAtClient'>,
) => {
  if (expense.createdAtClient) {
    return new Date(expense.createdAtClient);
  }

  return toDate(expense.createdAt);
};

const getExpenseDayTime = (expense: Pick<ExpenseData, 'date'>) => {
  const date = getExpenseDate(expense);
  if (!date) return 0;

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
};

const getExpenseCreatedTime = (
  expense: Pick<ExpenseData, 'createdAt' | 'createdAtClient'>,
) => {
  return getExpenseCreatedDate(expense)?.getTime() || 0;
};

export const sortExpensesByDateDesc = (
  a: Pick<
    ExpenseData,
    | 'date'
    | 'createdAt'
    | 'createdAtClient'
    | 'hasPendingWrites'
    | 'snapshotOrder'
  >,
  b: Pick<
    ExpenseData,
    | 'date'
    | 'createdAt'
    | 'createdAtClient'
    | 'hasPendingWrites'
    | 'snapshotOrder'
  >,
) => {
  const dateSort = getExpenseDayTime(b) - getExpenseDayTime(a);

  if (dateSort !== 0) {
    return dateSort;
  }

  const pendingSort =
    Number(Boolean(b.hasPendingWrites)) - Number(Boolean(a.hasPendingWrites));

  if (pendingSort !== 0) {
    return pendingSort;
  }

  const createdSort = getExpenseCreatedTime(b) - getExpenseCreatedTime(a);

  if (createdSort !== 0) {
    return createdSort;
  }

  return (a.snapshotOrder ?? 0) - (b.snapshotOrder ?? 0);
};

export const addExpense = async (
  amount: number,
  description: string,
  category: string,
  date?: Date,
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');
  const createdAtClient = Date.now();

  await expensesCollection.add({
    amount,
    description,
    category,
    userId: user.uid,
    date: date
      ? firestore.Timestamp.fromDate(date)
      : firestore.FieldValue.serverTimestamp(),
    createdAt: firestore.Timestamp.fromMillis(createdAtClient),
    createdAtClient,
  });
};

export const updateExpense = async (
  id: string,
  amount: number,
  description: string,
  category: string,
  date?: Date,
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  const updateData: any = {
    amount,
    description,
    category,
  };

  if (date) {
    updateData.date = firestore.Timestamp.fromDate(date);
  }

  await expensesCollection.doc(id).update(updateData);
};

export const deleteExpense = async (id: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  await expensesCollection.doc(id).delete();
};

export const getExpenses = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  const snapshot = await expensesCollection
    .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .get();

  const expenses = snapshot.docs.map((doc, index) => ({
    id: doc.id,
    ...doc.data(),
    hasPendingWrites: doc.metadata.hasPendingWrites,
    snapshotOrder: index,
  })) as ExpenseData[];

  return expenses.sort(sortExpensesByDateDesc);
};

export const subscribeToExpenses = (
  callback: (expenses: ExpenseData[]) => void,
) => {
  const user = auth().currentUser;
  if (!user) return () => {};

  return expensesCollection
    .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const expenses = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          hasPendingWrites: doc.metadata.hasPendingWrites,
          snapshotOrder: index,
        })) as ExpenseData[];
        callback(expenses.sort(sortExpensesByDateDesc));
      },
      error => {
        console.error('Error fetching expenses: ', error);
      },
    );
};
export const subscriptionsCollection = firestore().collection('subscriptions');

export interface SubscriptionData {
  id?: string;
  name: string;
  amount: number;
  billingCycle: 'Monthly' | 'Yearly';
  billingDate: number; // Day of month (1-31)
  category: string;
  isActive: boolean;
  duration?: number; // Duration in months
  userId: string;
  createdAt: any;
}

export const addSubscription = async (
  name: string,
  amount: number,
  billingCycle: 'Monthly' | 'Yearly',
  billingDate: number,
  category: string,
  isActive: boolean = true,
  duration?: number,
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  await subscriptionsCollection.add({
    name,
    amount,
    billingCycle,
    billingDate,
    category,
    isActive,
    duration: duration || null,
    userId: user.uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const updateSubscription = async (
  id: string,
  name: string,
  amount: number,
  billingCycle: 'Monthly' | 'Yearly',
  billingDate: number,
  category: string,
  isActive: boolean,
  duration?: number,
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  await subscriptionsCollection.doc(id).update({
    name,
    amount,
    billingCycle,
    billingDate,
    category,
    isActive,
    duration: duration || null,
  });
};

export const deleteSubscription = async (id: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  await subscriptionsCollection.doc(id).delete();
};

export const subscribeToSubscriptions = (
  callback: (subscriptions: SubscriptionData[]) => void,
) => {
  const user = auth().currentUser;
  if (!user) return () => {};

  return subscriptionsCollection
    .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const subscriptions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as SubscriptionData[];
        callback(subscriptions);
      },
      error => {
        console.error('Error fetching subscriptions: ', error);
      },
    );
};
