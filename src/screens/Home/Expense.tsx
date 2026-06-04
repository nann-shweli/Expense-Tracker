import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format, parse } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import {
  subscribeToExpenses,
  ExpenseData,
  getExpenseDate,
  sortExpensesByDateDesc,
} from '../../services/firestore';
import { useExpenseDate } from '../../context/ExpenseDateContext';

const Expense = () => {
  const navigation = useNavigation<any>();
  const { themeColors, currentTheme } = useTheme();
  const { selectedExpenseDate: selectedDate, setSelectedExpenseDate } =
    useExpenseDate();

  const [expenses, setExpenses] = useState<ExpenseData[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToExpenses(data => {
      setExpenses(data);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const markedDates = useMemo(() => {
    const marks: any = {};

    expenses.forEach(exp => {
      const date = getExpenseDate(exp);
      if (!date) return;

      const dateString = format(date, 'yyyy-MM-dd');

      marks[dateString] = {
        marked: true,
        dotColor: themeColors.primary.primary0,
      };
    });

    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: themeColors.primary.primary0,
    };

    return marks;
  }, [expenses, selectedDate, themeColors]);

  const dailyExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        const date = getExpenseDate(exp);
        if (!date) return false;

        return format(date, 'yyyy-MM-dd') === selectedDate;
      })
      .sort(sortExpensesByDateDesc);
  }, [expenses, selectedDate]);

  const dailyTotal = useMemo(() => {
    return dailyExpenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
  }, [dailyExpenses]);

  const selectedDateLabel = useMemo(() => {
    return format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy');
  }, [selectedDate]);

  const renderItem = ({ item }: { item: ExpenseData }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddExpense', { expense: item })}
      style={[styles.card, { backgroundColor: themeColors.card.fill1 }]}
    >
      <View style={styles.cardLeft}>
        <Typography size={16} style={styles.cardTitle}>
          {item.description}
        </Typography>

        <Typography size={12} color="secondary">
          {item.category}
        </Typography>
      </View>

      <Typography
        size={18}
        style={[styles.amountText, { color: themeColors.primary.primary0 }]}
      >
        {Number(item.amount).toLocaleString()} MMK
      </Typography>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.container.backgroundColor },
      ]}
    >
      <FlatList
        data={dailyExpenses}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View
              style={[
                styles.calendarShell,
                {
                  backgroundColor: themeColors.card.fill1,
                  borderColor: themeColors.navbar.borderColor,
                },
              ]}
            >
              <Calendar
                key={currentTheme}
                current={selectedDate}
                style={styles.calendar}
                onDayPress={(day: DateData) =>
                  setSelectedExpenseDate(day.dateString)
                }
                markedDates={markedDates}
                renderArrow={direction => (
                  <Icon
                    name={
                      direction === 'left'
                        ? 'chevron-back'
                        : 'chevron-forward'
                    }
                    size={22}
                    color={themeColors.primary.primary0}
                  />
                )}
                theme={{
                  calendarBackground: themeColors.card.fill1,
                  textSectionTitleColor: themeColors.text.secondary,
                  dayTextColor: themeColors.text.primary,
                  monthTextColor: themeColors.text.primary,
                  arrowColor: themeColors.primary.primary0,
                  selectedDayBackgroundColor: themeColors.primary.primary0,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: themeColors.primary.primary0,
                  textDisabledColor: themeColors.grey.grey100,
                  textDayFontWeight: '500',
                  textMonthFontWeight: '700',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 12,
                }}
                enableSwipeMonths
                hideExtraDays
              />
            </View>

            <View
              style={[
                styles.summaryContainer,
                {
                  backgroundColor: themeColors.card.fill1,
                  borderColor: themeColors.navbar.borderColor,
                },
              ]}
            >
              <View style={styles.summaryText}>
                <Typography size={12} color="secondary">
                  Selected date
                </Typography>

                <Typography size={16} style={styles.selectedDateText}>
                  {selectedDateLabel}
                </Typography>
              </View>

              <View style={styles.summaryAmount}>
                <Typography size={12} color="secondary">
                  Total
                </Typography>

                <Typography
                  size={22}
                  style={[
                    styles.totalText,
                    { color: themeColors.primary.primary0 },
                  ]}
                >
                  {dailyTotal.toLocaleString()} MMK
                </Typography>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <Typography style={styles.emptyText} color="secondary">
            No expenses for this date.
          </Typography>
        }
      />
    </View>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 180,
  },

  calendarShell: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  calendar: {
    borderRadius: 16,
  },

  summaryContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryText: {
    flex: 1,
    marginRight: 12,
  },

  selectedDateText: {
    fontWeight: '600',
    marginTop: 4,
  },

  summaryAmount: {
    alignItems: 'flex-end',
  },

  totalText: {
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },

  cardLeft: {
    flex: 1,
    marginRight: 12,
  },

  cardTitle: {
    fontWeight: 'bold',
  },

  amountText: {
    fontWeight: '500',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
