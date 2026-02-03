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
}

export const addExpense = async (amount: number, description: string, category: string, date?: Date) => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not logged in');

    await expensesCollection.add({
        amount,
        description,
        category,
        userId: user.uid,
        date: date ? firestore.Timestamp.fromDate(date) : firestore.FieldValue.serverTimestamp(),
        createdAt: firestore.FieldValue.serverTimestamp(),
    });
};

export const updateExpense = async (id: string, amount: number, description: string, category: string, date?: Date) => {
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

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as ExpenseData[];
};

export const subscribeToExpenses = (callback: (expenses: ExpenseData[]) => void) => {
    const user = auth().currentUser;
    if (!user) return () => { };

    return expensesCollection
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const expenses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as ExpenseData[];
            callback(expenses);
        }, error => {
            console.error("Error fetching expenses: ", error);
        });
};
export const subscriptionsCollection = firestore().collection('subscriptions');

export interface SubscriptionData {
    id?: string;
    name: string;
    amount: number;
    billingCycle: 'Monthly' | 'Yearly';
    billingDate: number; // Day of month (1-31)
    category: string;
    userId: string;
    createdAt: any;
}

export const addSubscription = async (name: string, amount: number, billingCycle: 'Monthly' | 'Yearly', billingDate: number, category: string) => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not logged in');

    await subscriptionsCollection.add({
        name,
        amount,
        billingCycle,
        billingDate,
        category,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
    });
};

export const updateSubscription = async (id: string, name: string, amount: number, billingCycle: 'Monthly' | 'Yearly', billingDate: number, category: string) => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not logged in');

    await subscriptionsCollection.doc(id).update({
        name,
        amount,
        billingCycle,
        billingDate,
        category,
    });
};

export const deleteSubscription = async (id: string) => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not logged in');

    await subscriptionsCollection.doc(id).delete();
};

export const subscribeToSubscriptions = (callback: (subscriptions: SubscriptionData[]) => void) => {
    const user = auth().currentUser;
    if (!user) return () => { };

    return subscriptionsCollection
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const subscriptions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as SubscriptionData[];
            callback(subscriptions);
        }, error => {
            console.error("Error fetching subscriptions: ", error);
        });
};
