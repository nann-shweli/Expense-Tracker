import React, { useEffect, useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { format, addMonths, subMonths, isSameMonth, startOfMonth, endOfMonth } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import { PieChart } from "react-native-gifted-charts";
import { useNavigation } from '@react-navigation/native';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import { subscribeToExpenses, ExpenseData } from '../../services/firestore';
import { CATEGORY_COLORS } from '../../constants/categories';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((data) => {
      setExpenses(data);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (!exp.date) return false;
      const itemDate = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
      return isSameMonth(itemDate, selectedMonth);
    });
  }, [expenses, selectedMonth]);

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    filteredExpenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(exp.amount);
    });

    return Object.keys(categoryTotals).map((cat, index) => ({
      value: categoryTotals[cat],
      color: CATEGORY_COLORS[cat] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      label: cat,
      onPress: () => navigation.navigate('AddExpense', { category: cat }),
      text: `${Math.round((categoryTotals[cat] / (totalSpend || 1)) * 100)}%`
    })).sort((a, b) => b.value - a.value);
  }, [filteredExpenses, totalSpend, navigation]);

  const handlePreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const handleNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  const renderHeader = () => (
    <View>
      <View style={styles.monthSelectorRow}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
            <Icon name="chevron-back" size={24} color={themeColors.text.primary} />
          </TouchableOpacity>
          <Typography size={18} style={{ fontWeight: '600' }}>{format(selectedMonth, 'MMM yyyy')}</Typography>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Icon name="chevron-forward" size={24} color={themeColors.text.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.filterButton, { borderColor: themeColors.navbar.borderColor }]}>
          <Typography size={14}>Monthly</Typography>
          <Icon name="chevron-down" size={16} color={themeColors.text.secondary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Typography size={14} color="secondary">Income</Typography>
          <Typography size={18} style={{ fontWeight: 'bold' }}>0.00</Typography>
        </View>
        <View style={[styles.summaryItem, styles.expenseSummary]}>
          <Typography size={14} color="secondary">Expenses</Typography>
          <Typography size={18} style={{ fontWeight: 'bold' }}> {totalSpend.toLocaleString()} MMK</Typography>
          <View style={{ position: 'absolute', bottom: -1, left: '10%', right: '10%', height: 3, borderRadius: 2, backgroundColor: themeColors.primary.primary0 }} />
        </View>
      </View>

      {chartData.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            donut
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={themeColors.container.backgroundColor}
            centerLabelComponent={() => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Typography size={16} style={{ fontWeight: 'bold' }}>{Math.round(totalSpend).toLocaleString()}</Typography>
                <Typography size={10} color="secondary">Total</Typography>
              </View>
            )}
          />
          <View style={styles.legendContainer}>
            {chartData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.legendItem}
                onPress={() => navigation.navigate('AddExpense', { category: item.label })}
              >
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Typography size={12} style={styles.legendText} numberOfLines={1}>{item.label}</Typography>
                <Typography size={11} color="secondary">{item.text}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Typography color="secondary">No data for this month</Typography>
        </View>
      )}

      <Typography size={18} style={{ marginTop: 24, marginBottom: 12, fontWeight: '600' }}>Transactions</Typography>
    </View>
  );

  const renderItem = ({ item }: { item: ExpenseData }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddExpense', { expense: item })}
      style={[styles.card, { backgroundColor: themeColors.card.fill1 }]}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: CATEGORY_COLORS[item.category] || themeColors.primary.primary0 + '20' }]}>
          <Icon name="receipt-outline" size={20} color={CATEGORY_COLORS[item.category] || themeColors.primary.primary0} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography size={16} style={{ fontWeight: '600' }} numberOfLines={1}>{item.description}</Typography>
          <Typography size={12} color="secondary">{item.category} • {format(item.date?.toDate ? item.date.toDate() : new Date(item.date), 'dd MMM')}</Typography>
        </View>
      </View>
      <Typography size={16} style={{ fontWeight: 'bold', color: themeColors.text.primary }}>{Number(item.amount).toLocaleString()} MMK</Typography>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.container.backgroundColor }]}>
      <FlatList
        data={filteredExpenses}
        renderItem={renderItem}
        keyExtractor={item => item.id || Math.random().toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          filteredExpenses.length === 0 ? null : (
            <Typography style={{ textAlign: 'center', marginTop: 20 }} color="secondary">No more expenses.</Typography>
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
  monthSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.1)',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  expenseSummary: {
    position: 'relative',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  legendContainer: {
    marginLeft: 15,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
    marginRight: '5%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    flex: 1,
    marginRight: 4,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.05)',
    borderRadius: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  }
});
