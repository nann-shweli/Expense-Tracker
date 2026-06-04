import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../hooks/useTheme';
import Typography from '../../atoms/Typography';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../../constants/categories';
import {
  ExpenseData,
  getExpenseCreatedDate,
  getExpenseDate,
} from '../../../services/firestore';

const TransactionItems = ({
  item,
  isLast = false,
}: {
  item: ExpenseData;
  isLast?: boolean;
}) => {
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const categoryIcon = CATEGORY_ICONS[item.category] || 'receipt-outline';
  const categoryColor = CATEGORY_COLORS[item.category] || themeColors.primary.primary0;
  const transactionDate = getExpenseCreatedDate(item) || getExpenseDate(item) || new Date();
  const amountValue = Math.abs(Number(item.amount) || 0);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddExpense', { expense: item })}
      style={styles.row}
    >
      <View style={[styles.categoryIcon, { backgroundColor: categoryColor }]}>
        <Icon name={categoryIcon} size={24} color="#FFFFFF" />
      </View>

      <View
        style={[
          styles.rowBody,
          !isLast && {
            borderBottomColor: themeColors.navbar.borderColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <View style={styles.details}>
          <Typography size={16} style={styles.title} numberOfLines={2}>
            {item.description}
          </Typography>

          <Typography size={12} color="secondary">
            {format(transactionDate, 'd MMMM yyyy, hh:mm a')}
          </Typography>
        </View>

        <Typography
          size={16}
          style={[styles.amount, { color: themeColors.error.error0 }]}
          numberOfLines={1}
        >
          -{amountValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} MMK
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItems;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    marginTop: 18,
  },
  rowBody: {
    flex: 1,
    minHeight: 88,
    paddingTop: 18,
    paddingRight: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 4,
  },
  amount: {
    fontWeight: '800',
    textAlign: 'right',
    marginTop: 2,
    maxWidth: 150,
  },
});
