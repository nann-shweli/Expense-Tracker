import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import { getExpenses, subscribeToExpenses, ExpenseData } from '../../services/firestore';

const Dashboard = () => {
  const { themeColors } = useTheme();
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((data) => {
      setExpenses(data);
      calculateTotalSpend(data);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const calculateTotalSpend = (data: ExpenseData[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const total = data.reduce((sum, item) => {
      const itemDate = item.date?.toDate ? item.date.toDate() : new Date(item.date);

      if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
        return sum + (Number(item.amount) || 0);
      }
      return sum;
    }, 0);

    setTotalSpend(total);
  };


  const renderItem = ({ item }: { item: ExpenseData }) => (
    <View style={[styles.card, { backgroundColor: themeColors.card.fill1 }]}>
      <View>
        <Typography size={16} style={{ fontWeight: 'bold' }}>{item.description}</Typography>
        <Typography size={12} color="secondary">{item.category}</Typography>
      </View>
      <Typography size={18} color="primary" style={{ color: themeColors.primary.primary0 }}>{Number(item.amount).toLocaleString()} MMK</Typography>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.container.backgroundColor }]}>
      <View style={styles.header}>
        <Typography size={24} style={{ fontWeight: 'bold' }}>Dashboard</Typography>
      </View>

      <View style={styles.content}>
        <View style={{ marginBottom: 20 }}>
          <Typography size={14} color="secondary">Total Spend (This Month)</Typography>
          <Typography size={32} style={{ fontWeight: 'bold', color: themeColors.primary.primary0 }}>{totalSpend.toLocaleString()} MMK</Typography>
        </View>


        <Typography size={18} style={{ marginTop: 24, marginBottom: 8 }}>Recent Expenses</Typography>

        {expenses.length === 0 ? (
          <Typography style={{ marginTop: 20, textAlign: 'center' }} color="secondary">No expenses found.</Typography>
        ) : (
          <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={item => item.id || Math.random().toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 80
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  addButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  }
});
