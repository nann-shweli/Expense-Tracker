import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
    <>
      <DashboardHeader
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        totalSpend={totalSpend}
        chartData={chartData}
      />

      <View
        style={[
          styles.historyPanelHeader,
          {
            backgroundColor: themeColors.card.fill1,
          },
        ]}
      >
        <Typography size={20} style={styles.historyTitle}>
         Transactions
        </Typography>

        <TouchableOpacity
          onPress={() => navigation.navigate('Expenses')}
          style={styles.seeAllButton}
        >
          <Typography size={14} style={styles.seeAllText}>
            See all
          </Typography>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ExpenseData;
    index: number;
  }) => (
    <View
      style={[
        { backgroundColor: themeColors.card.fill1 },
        index === filteredExpenses.length - 1 && styles.historyLastRow,
      ]}
    >
      <TransactionItems
        item={item}
        isLast={index === filteredExpenses.length - 1}
      />
    </View>
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
        ListEmptyComponent={
          <View
            style={[
              styles.historyEmpty,
              {
                backgroundColor: themeColors.card.fill1,
              },
            ]}
          >
            <Typography style={styles.emptyText} color="secondary">
              No expenses for this month.
            </Typography>
          </View>
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  historyPanelHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  historyTitle: {
    fontWeight: '700',
  },
  historyLastRow: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  historyEmpty: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  seeAllButton: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllText: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 28,
  },
});
