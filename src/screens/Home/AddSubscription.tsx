import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addSubscription, updateSubscription, deleteSubscription, SubscriptionData } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import Loading from '../../components/atoms/Loading';

const AddSubscription = () => {
    const { themeColors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const subscriptionToEdit: SubscriptionData | undefined = route.params?.subscription;

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
    const [billingDate, setBillingDate] = useState('1');
    const [category, setCategory] = useState('Entertainment');
    const [isActive, setIsActive] = useState(true);
    const [duration, setDuration] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (subscriptionToEdit) {
            setName(subscriptionToEdit.name);
            setAmount(String(subscriptionToEdit.amount));
            setBillingCycle(subscriptionToEdit.billingCycle);
            setBillingDate(String(subscriptionToEdit.billingDate));
            setCategory(subscriptionToEdit.category);
            setIsActive(subscriptionToEdit.isActive ?? true);
            setDuration(subscriptionToEdit.duration ? String(subscriptionToEdit.duration) : '');
        }
    }, [subscriptionToEdit]);

    const handleSave = async () => {
        if (!name || !amount || !billingDate) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const dateNum = parseInt(billingDate);
        if (isNaN(dateNum) || dateNum < 1 || dateNum > 31) {
            Alert.alert('Error', 'Billing date must be between 1 and 31');
            return;
        }

        const durationNum = duration ? parseInt(duration) : undefined;

        try {
            setIsSaving(true);
            if (subscriptionToEdit && subscriptionToEdit.id) {
                await updateSubscription(subscriptionToEdit.id, name, Number(amount), billingCycle, dateNum, category, isActive, durationNum);
            } else {
                await addSubscription(name, Number(amount), billingCycle, dateNum, category, isActive, durationNum);
            }
            setIsSaving(false);
            setTimeout(() => {
                navigation.goBack();
            }, 50);
        } catch (error: any) {
            setIsSaving(false);
            Alert.alert('Error', error.message);
        }
    };

    const handleDelete = async () => {
        if (!subscriptionToEdit?.id) return;

        Alert.alert(
            'Delete Subscription',
            'Are you sure you want to delete this subscription?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await deleteSubscription(subscriptionToEdit.id!);
                            setIsDeleting(false);
                            setTimeout(() => {
                                navigation.goBack();
                            }, 50);
                        } catch (error: any) {
                            setIsDeleting(false);
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeColors.container.backgroundColor }]}>
            <View style={styles.content}>
                <Typography size={24} style={styles.title}>{subscriptionToEdit ? 'Edit Subscription' : 'Add Subscription'}</Typography>

                <View style={styles.statusContainer}>
                    <Typography size={16}>Status</Typography>
                    <TouchableOpacity
                        onPress={() => setIsActive(!isActive)}
                        style={[styles.statusToggle, { backgroundColor: isActive ? themeColors.primary.primary0 : themeColors.text.secondary }]}
                    >
                        <Typography style={{ color: '#fff' }}>{isActive ? 'Active' : 'Paused'}</Typography>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="Subscription Name (e.g. Netflix)"
                    placeholderTextColor={themeColors.text.secondary}
                    value={name}
                    onChangeText={setName}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                    autoFocus={!subscriptionToEdit}
                />

                <TextInput
                    placeholder="Amount"
                    placeholderTextColor={themeColors.text.secondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                />

                <Typography size={14} color="secondary" style={styles.label}>Billing Cycle</Typography>
                <View style={styles.cycleContainer}>
                    <TouchableOpacity
                        onPress={() => setBillingCycle('Monthly')}
                        style={[styles.cycleButton, billingCycle === 'Monthly' && { backgroundColor: themeColors.primary.primary0 }]}
                    >
                        <Typography style={{ color: billingCycle === 'Monthly' ? '#fff' : themeColors.text.primary }}>Monthly</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setBillingCycle('Yearly')}
                        style={[styles.cycleButton, billingCycle === 'Yearly' && { backgroundColor: themeColors.primary.primary0 }]}
                    >
                        <Typography style={{ color: billingCycle === 'Yearly' ? '#fff' : themeColors.text.primary }}>Yearly</Typography>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="Billing Day (1-31)"
                    placeholderTextColor={themeColors.text.secondary}
                    keyboardType="numeric"
                    value={billingDate}
                    onChangeText={setBillingDate}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                />

                <TextInput
                    placeholder="Duration (Months, optional)"
                    placeholderTextColor={themeColors.text.secondary}
                    keyboardType="numeric"
                    value={duration}
                    onChangeText={setDuration}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                />

                <TextInput
                    placeholder="Category"
                    placeholderTextColor={themeColors.text.secondary}
                    value={category}
                    onChangeText={setCategory}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                        <Typography color="secondary">Cancel</Typography>
                    </TouchableOpacity>

                    {subscriptionToEdit && (
                        <TouchableOpacity
                            onPress={handleDelete}
                            style={[styles.deleteButton]}
                            disabled={isDeleting || isSaving}
                        >
                            {isDeleting ? <Loading /> : <Typography style={{ color: '#fff' }}>Delete</Typography>}
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.saveButton, { backgroundColor: themeColors.primary.primary0 }]}
                        disabled={isSaving || isDeleting}
                    >
                        {isSaving ? <Loading /> : <Typography style={{ color: '#fff' }}>{subscriptionToEdit ? 'Update' : 'Save'}</Typography>}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default AddSubscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        marginTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    statusToggle: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    cycleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    cycleButton: {
        flex: 1,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        flex: 1,
        padding: 15,
        marginLeft: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        flex: 1,
        padding: 15,
        marginLeft: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4444',
    },
});
