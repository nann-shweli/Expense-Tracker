import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../hooks/useTheme';
import Typography from '../../atoms/Typography';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../../constants/categories';
import { ExpenseData } from '../../../services/firestore';

const TransactionItems = ({ item }: { item: ExpenseData }) => {
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const categoryIcon = CATEGORY_ICONS[item.category] || 'receipt-outline';
  const categoryColor = CATEGORY_COLORS[item.category] || themeColors.primary.primary0;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddExpense', { expense: item })}
      style={[styles.card, { backgroundColor: themeColors.card.fill1 }]}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: categoryColor }]}>
          <Icon name={categoryIcon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.flex1}>
          <Typography size={16} style={styles.amount} numberOfLines={1}>{item.description}</Typography>
          <Typography size={12} color="secondary">{item.category} • {format(item.date?.toDate ? item.date.toDate() : new Date(item.date), 'dd MMM')}</Typography>
        </View>
      </View>
      <Typography size={16} style={[styles.amount,{color: themeColors.text.primary }]}>{Number(item.amount).toLocaleString()} MMK</Typography>
    </TouchableOpacity>
  );
};

export default TransactionItems;

const styles = StyleSheet.create({
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
  },
  flex1: {
    flex: 1,
  },
  amount:{ fontWeight: 'bold', }
});
