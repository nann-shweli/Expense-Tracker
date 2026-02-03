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
