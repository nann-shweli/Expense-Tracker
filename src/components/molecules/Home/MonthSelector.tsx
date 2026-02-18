import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../../hooks/useTheme';
import Typography from '../../atoms/Typography';

interface MonthSelectorProps {
    selectedMonth: Date;
    setSelectedMonth: (date: Date) => void;
    totalSpend: number;
}

const MonthSelector = ({ selectedMonth, setSelectedMonth, totalSpend }: MonthSelectorProps) => {
    const { themeColors } = useTheme();

    const handlePreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
    const handleNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

    return (
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
        </View>
    );
};

export default MonthSelector;

const styles = StyleSheet.create({
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
});
