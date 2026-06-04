import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { isSameMonth } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import {
  subscribeToExpenses,
  ExpenseData,
  getExpenseDate,
  sortExpensesByDateDesc,
} from '../../services/firestore';
import { CATEGORY_COLORS } from '../../constants/categories';
import TransactionItems from '../../components/molecules/Home/TransactionItems';
import DashboardHeader from '../../components/organisms/Home/DashboardHeader';

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const unsubscribe = subscribeToExpenses(data => {
      setExpenses(data);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        const itemDate = getExpenseDate(exp);
        if (!itemDate) return false;

        return isSameMonth(itemDate, selectedMonth);
      })
      .sort(sortExpensesByDateDesc);
  }, [expenses, selectedMonth]);

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    filteredExpenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(exp.amount);
    });

    return Object.keys(categoryTotals)
      .map((cat, index) => ({
        value: categoryTotals[cat],
        color:
          CATEGORY_COLORS[cat] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        label: cat,
        onPress: () => navigation.navigate('AddExpense', { category: cat }),
        text: `${Math.round((categoryTotals[cat] / (totalSpend || 1)) * 100)}%`,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses, totalSpend, navigation]);

  const renderHeader = () => (
    <DashboardHeader
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      totalSpend={totalSpend}
      chartData={chartData}
    />
  );

  const renderItem = ({ item }: { item: ExpenseData }) => (
    <TransactionItems item={item} />
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.container.backgroundColor },
      ]}
    >
      <FlatList
        data={filteredExpenses}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          filteredExpenses.length === 0 ? null : (
            <Typography style={styles.emptyText} color="secondary">
              No more expenses.
            </Typography>
          )
        }
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
