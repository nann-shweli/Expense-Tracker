import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';

import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import { subscribeToExpenses, ExpenseData } from '../../services/firestore';

const Expense = () => {
  const { themeColors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((data) => {
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
      if (!marks[dateString]) {
        marks[dateString] = { marked: true, dotColor: themeColors.primary.primary0 };
      }
    });

    // Highlight selected date
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
    return dailyExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [dailyExpenses]);


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
      <Calendar
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
      />

      <View style={styles.summaryContainer}>
        <Typography size={16} color="secondary">Total for {selectedDate}</Typography>
        <Typography size={24} style={{ fontWeight: 'bold', color: themeColors.primary.primary0 }}>{dailyTotal.toLocaleString()} MMK</Typography>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={dailyExpenses}
          renderItem={renderItem}
          keyExtractor={item => item.id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Typography style={{ textAlign: 'center', marginTop: 20 }} color="secondary">No expenses for this date.</Typography>
          }
        />
      </View>
    </View>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 200
  },
  title: {
    paddingHorizontal: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
