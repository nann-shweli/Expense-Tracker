import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import { subscribeToExpenses, ExpenseData } from '../../services/firestore';

const Expense = () => {
  const navigation = useNavigation<any>();
  const { themeColors, currentTheme } = useTheme();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
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
      const date = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
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
    return expenses.filter(exp => {
      const date = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
      return format(date, 'yyyy-MM-dd') === selectedDate;
    });
  }, [expenses, selectedDate]);

  const dailyTotal = useMemo(() => {
    return dailyExpenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
  }, [dailyExpenses]);

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
            <Calendar
              key={currentTheme}
              current={selectedDate}
              onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={{
                calendarBackground: themeColors.container.backgroundColor,
                textSectionTitleColor: themeColors.text.secondary,
                dayTextColor: themeColors.text.primary,
                monthTextColor: themeColors.text.primary,
                arrowColor: themeColors.primary.primary0,
                selectedDayBackgroundColor: themeColors.primary.primary0,
                selectedDayTextColor: '#ffffff',
                todayTextColor: themeColors.primary.primary0,
              }}
              enableSwipeMonths
            />

            <View style={styles.summaryContainer}>
              <Typography size={16} color="secondary">
                Total for {selectedDate}
              </Typography>

              <Typography
                size={24}
                style={[
                  styles.totalText,
                  { color: themeColors.primary.primary0 },
                ]}
              >
                {dailyTotal.toLocaleString()} MMK
              </Typography>
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

  summaryContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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