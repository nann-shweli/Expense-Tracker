import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../hooks/useTheme';
import Typography from '../../atoms/Typography';

interface ChartViewProps {
  chartData: any[];
  totalSpend: number;
}

const CenterLabel = ({ totalSpend }: { totalSpend: number }) => (
  <View style={styles.centerLabel}>
    <Typography size={16} style={styles.centralLabelText}>
      {Math.round(totalSpend).toLocaleString()}
    </Typography>

    <Typography size={10} color="secondary">
      Total
    </Typography>
  </View>
);

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
        // eslint-disable-next-line react/no-unstable-nested-components
        centerLabelComponent={() => <CenterLabel totalSpend={totalSpend} />}
      />
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.legendItem}
            onPress={() =>
              navigation.navigate('AddExpense', {
                category: item.label,
              })
            }
          >
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />

            <View style={styles.legendText}>
              <Typography size={12}>{item.label}</Typography>
              <Typography size={11} color="secondary">
                {item.text}
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChartView;

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    gap: 8,
  },
  legendItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
