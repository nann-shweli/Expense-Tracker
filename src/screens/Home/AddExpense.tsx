import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';

import { addExpense, updateExpense, deleteExpense, ExpenseData } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import Loading from '../../components/atoms/Loading';

const AddExpense = () => {
    const { themeColors, currentTheme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const expenseToEdit: ExpenseData | undefined = route.params?.expense;

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (expenseToEdit) {
            setAmount(String(expenseToEdit.amount));
            setDescription(expenseToEdit.description);
            setCategory(expenseToEdit.category);

            const date = expenseToEdit.date?.toDate ? expenseToEdit.date.toDate() : new Date(expenseToEdit.date);
            setSelectedDate(format(date, 'yyyy-MM-dd'));
        }
    }, [expenseToEdit]);

    const handleSave = async () => {
        if (!amount || !description) {
            Alert.alert('Error', 'Please enter amount and description');
            return;
        }

        try {
            setIsSaving(true);
            const expenseDate = new Date(selectedDate);

            if (expenseToEdit && expenseToEdit.id) {
                await updateExpense(expenseToEdit.id, Number(amount), description, category, expenseDate);
            } else {
                await addExpense(Number(amount), description, category, expenseDate);
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
        if (!expenseToEdit?.id) return;

        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await deleteExpense(expenseToEdit.id!);
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
        <View style={[styles.container, { backgroundColor: themeColors.container.backgroundColor }]}>
            <View style={styles.content}>
                <Typography size={24} style={styles.title}>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</Typography>
                <Typography color="secondary" size={15} style={styles.dateLabel}>Date</Typography>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.input, styles.dateInput, { borderColor: themeColors.text.secondary }]}
                >
                    <Typography color="primary" size={16}>{selectedDate}</Typography>
                </TouchableOpacity>

                <TextInput
                    placeholder="Amount"
                    placeholderTextColor={themeColors.text.secondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                    autoFocus={!expenseToEdit}
                />

                <TextInput
                    placeholder="Description"
                    placeholderTextColor={themeColors.text.secondary}
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                        <Typography color="secondary">Cancel</Typography>
                    </TouchableOpacity>

                    {expenseToEdit && (
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
                        {isSaving ? <Loading /> : <Typography style={{ color: '#fff' }}>{expenseToEdit ? 'Update' : 'Save'}</Typography>}
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDatePicker(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: themeColors.container.backgroundColor }]}>
                        <Calendar
                            key={currentTheme}
                            current={selectedDate}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: themeColors.primary.primary0 }
                            }}
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                                setShowDatePicker(false);
                            }}
                            theme={{
                                calendarBackground: themeColors.container.backgroundColor,
                                textSectionTitleColor: themeColors.text.secondary,
                                dayTextColor: themeColors.text.primary,
                                monthTextColor: themeColors.text.primary,
                                arrowColor: themeColors.primary.primary0,
                                todayTextColor: themeColors.primary.primary0,
                                selectedDayBackgroundColor: themeColors.primary.primary0,
                                selectedDayTextColor: '#ffffff',
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default AddExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    dateInput: {
        justifyContent: 'center',
        paddingVertical: 5,
    },
    dateLabel: {
        paddingBottom: 12
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 20,
        padding: 10,
        elevation: 5,
    },
});
