import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { subscribeToSubscriptions, SubscriptionData } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import Loading from '../../components/atoms/Loading';
import Icon from 'react-native-vector-icons/Ionicons';

const Subscription = () => {
    const { themeColors } = useTheme();
    const navigation = useNavigation<any>();
    const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToSubscriptions((data) => {
            setSubscriptions(data);
            setLoading(false);
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const totals = useMemo(() => {
        let monthly = 0;
        let yearly = 0;
        subscriptions.filter(sub => sub.isActive).forEach(sub => {
            if (sub.billingCycle === 'Monthly') {
                monthly += Number(sub.amount);
                yearly += Number(sub.amount) * 12;
            } else {
                yearly += Number(sub.amount);
                monthly += Number(sub.amount) / 12;
            }
        });
        return { monthly, yearly };
    }, [subscriptions]);

    const renderItem = ({ item }: { item: SubscriptionData }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('AddSubscription', { subscription: item })}
            style={[styles.card, { backgroundColor: themeColors.card.fill1, opacity: item.isActive ? 1 : 0.6 }]}
        >
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.isActive ? themeColors.primary.primary0 : themeColors.text.secondary }]}>
                    <Icon name={item.isActive ? "card" : "pause"} size={20} color="#fff" />
                </View>
                <View>
                    <Typography size={16} style={{ fontWeight: 'bold' }}>
                        {item.name} {!item.isActive && <Typography size={12}>(Paused)</Typography>}
                    </Typography>
                    <Typography size={12} color="secondary">
                        {item.category} • Day {item.billingDate}
                        {item.duration ? ` • ${item.duration}m` : ''}
                    </Typography>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Typography size={16} style={{ fontWeight: 'bold', color: item.isActive ? themeColors.primary.primary0 : themeColors.text.secondary }}>
                    {item.amount.toLocaleString()} MMK
                </Typography>
                <Typography size={12} color="secondary">
                    Per {item.billingCycle === 'Monthly' ? 'Month' : 'Year'}
                </Typography>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Loading size="large" color={themeColors.primary.primary0} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.container.backgroundColor }]}>
            <View style={styles.header}>
                <View style={[styles.summaryCard, { backgroundColor: themeColors.primary.primary0 }]}>
                    <View style={styles.summaryItem}>
                        <Typography color="#fff" size={14}>Monthly Total</Typography>
                        <Typography color="#fff" size={24} style={{ fontWeight: 'bold' }}>
                            {totals.monthly.toLocaleString()} MMK
                        </Typography>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}>
                        <Typography color="#fff" size={14}>Yearly Total</Typography>
                        <Typography color="#fff" size={20} style={{ fontWeight: 'bold' }}>
                            {totals.yearly.toLocaleString()} MMK
                        </Typography>
                    </View>
                </View>
            </View>

            <View style={styles.listHeader}>
                <Typography size={18} style={{ fontWeight: 'bold' }}>Your Subscriptions</Typography>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddSubscription')}
                    style={[styles.addButton, { backgroundColor: themeColors.primary.primary0 }]}
                >
                    <Icon name="add" size={20} color="#fff" />
                    <Typography style={{ color: '#fff', marginLeft: 4 }}>Add</Typography>
                </TouchableOpacity>
            </View>

            <FlatList
                data={subscriptions}
                renderItem={renderItem}
                keyExtractor={item => item.id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="notifications-off-outline" size={60} color={themeColors.text.secondary} />
                        <Typography style={{ textAlign: 'center', marginTop: 10 }} color="secondary">
                            No active subscriptions.
                        </Typography>
                    </View>
                }
            />
        </View>
    );
};

export default Subscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
    },
    summaryCard: {
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 15,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
});
