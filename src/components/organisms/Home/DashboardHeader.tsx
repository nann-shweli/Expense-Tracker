import React from 'react';
import { View, StyleSheet } from 'react-native';

import Typography from '../../atoms/Typography';
import MonthSelector from '../../molecules/Home/MonthSelector';
import ChartView from '../../molecules/Home/ChartView';

interface DashboardHeaderProps {
    selectedMonth: Date;
    setSelectedMonth: (date: Date) => void;
    totalSpend: number;
    chartData: any[];
}

const DashboardHeader = ({
    selectedMonth,
    setSelectedMonth,
    totalSpend,
    chartData
}: DashboardHeaderProps) => {
    return (
        <View>
            <MonthSelector
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                totalSpend={totalSpend}
            />

            {chartData.length > 0 ? (
                <ChartView chartData={chartData} totalSpend={totalSpend} />
            ) : (
                <View style={styles.emptyChart}>
                    <Typography color="secondary">No data for this month</Typography>
                </View>
            )}
        </View>
    );
};

export default DashboardHeader;

const styles = StyleSheet.create({
    emptyChart: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(150,150,150,0.05)',
        borderRadius: 20,
    },
});
