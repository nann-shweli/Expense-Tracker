import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import { getExpenses, subscribeToExpenses, ExpenseData } from '../../services/firestore';

const Dashboard = () => {
  const { themeColors } = useTheme();
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((data) => {
      setExpenses(data);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(exp => {
      const itemDate = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
      return isSameMonth(itemDate, selectedMonth);
    });
  }, [expenses, selectedMonth]);

  useEffect(() => {
    const total = filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setTotalSpend(total);
  }, [filteredExpenses]);

  const handlePreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const handleNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  const renderItem = ({ item }: { item: ExpenseData }) => (
    <View style={[styles.card, { backgroundColor: themeColors.card.fill1 }]}>
      <View>
        <Typography size={16} style={{ fontWeight: 'bold' }}>{item.description}</Typography>
        <Typography size={12} color="secondary">{item.category} • {format(item.date?.toDate ? item.date.toDate() : new Date(item.date), 'dd MMM')}</Typography>
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
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
            <Icon name="chevron-back" size={24} color={themeColors.text.primary} />
          </TouchableOpacity>
          <Typography size={18} style={{ fontWeight: '600' }}>{format(selectedMonth, 'MMMM yyyy')}</Typography>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Icon name="chevron-forward" size={24} color={themeColors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Typography size={14} color="secondary">Total Spend ({format(selectedMonth, 'MMM')})</Typography>
          <Typography size={32} style={{ fontWeight: 'bold', color: themeColors.primary.primary0 }}>{totalSpend.toLocaleString()} MMK</Typography>
        </View>


        <Typography size={18} style={{ marginTop: 24, marginBottom: 8 }}>Expenses</Typography>

        {filteredExpenses.length === 0 ? (
          <Typography style={{ marginTop: 20, textAlign: 'center' }} color="secondary">No expenses for this month.</Typography>
        ) : (
          <FlatList
            data={filteredExpenses}
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
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
