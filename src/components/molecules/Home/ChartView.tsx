import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../hooks/useTheme';
import Typography from '../../atoms/Typography';

interface ChartViewProps {
    chartData: any[];
    totalSpend: number;
}

const ChartView = ({ chartData, totalSpend }: ChartViewProps) => {
    const { themeColors } = useTheme();
    const navigation = useNavigation<any>();

    return (
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
    );
};

export default ChartView;

const styles = StyleSheet.create({
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
});