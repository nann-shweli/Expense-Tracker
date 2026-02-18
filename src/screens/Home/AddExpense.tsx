import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

import { addExpense, updateExpense, deleteExpense, ExpenseData } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import Loading from '../../components/atoms/Loading';
import { CATEGORIES, CATEGORY_COLORS } from '../../constants/categories';

const AddExpense = () => {
    const { themeColors, currentTheme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const expenseToEdit: ExpenseData | undefined = route.params?.expense;
    const initialCategory = route.params?.category;

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
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
        } else if (initialCategory) {
            setCategory(initialCategory);
        }
    }, [expenseToEdit, initialCategory]);

    const handleSave = async () => {
        if (!amount.trim() || !description.trim() || !category) {
            Alert.alert('Error', 'Please fill in all fields (Amount, Description, and Category)');
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
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Typography size={24} style={styles.title}>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</Typography>

                    <Typography color="secondary" size={14} style={styles.label}>Date</Typography>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.input, styles.dateInput, { borderColor: themeColors.navbar.borderColor, backgroundColor: themeColors.card.fill1 }]}
                    >
                        <Icon name="calendar-outline" size={20} color={themeColors.primary.primary0} style={{ marginRight: 10 }} />
                        <Typography color="primary" size={16}>{selectedDate}</Typography>
                    </TouchableOpacity>

                    <Typography color="secondary" size={14} style={styles.label}>Amount (MMK) <Typography color="error" size={14}>*</Typography></Typography>
                    <TextInput
                        placeholder="0"
                        placeholderTextColor={themeColors.text.secondary}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.navbar.borderColor, backgroundColor: themeColors.card.fill1 }]}
                        autoFocus={!expenseToEdit}
                    />

                    <Typography color="secondary" size={14} style={styles.label}>Description <Typography color="error" size={14}>*</Typography></Typography>
                    <TextInput
                        placeholder="What was this for?"
                        placeholderTextColor={themeColors.text.secondary}
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.navbar.borderColor, backgroundColor: themeColors.card.fill1 }]}
                    />

                    <Typography color="secondary" size={14} style={styles.label}>Category <Typography color="error" size={14}>*</Typography></Typography>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setCategory(cat)}
                                style={[
                                    styles.categoryItem,
                                    {
                                        borderColor: category === cat ? CATEGORY_COLORS[cat] : themeColors.navbar.borderColor,
                                        backgroundColor: category === cat ? CATEGORY_COLORS[cat] + '20' : themeColors.card.fill1
                                    }
                                ]}
                            >
                                <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[cat] }]} />
                                <Typography
                                    size={12}
                                    style={{
                                        color: category === cat ? themeColors.text.primary : themeColors.text.secondary,
                                        fontWeight: category === cat ? 'bold' : 'normal'
                                    }}
                                >
                                    {cat}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                            <Typography color="secondary">Cancel</Typography>
                        </TouchableOpacity>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {expenseToEdit && (
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    style={[styles.deleteButton]}
                                    disabled={isDeleting || isSaving}
                                >
                                    {isDeleting ? <Loading /> : <Typography style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Typography>}
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={handleSave}
                                style={[styles.saveButton, { backgroundColor: themeColors.primary.primary0 }]}
                                disabled={isSaving || isDeleting}
                            >
                                {isSaving ? <Loading /> : <Typography style={{ color: '#fff', fontWeight: 'bold' }}>{expenseToEdit ? 'Update' : 'Save'}</Typography>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

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
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateInput: {
        marginBottom: 20,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    categoryItem: {
        width: '31%',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingBottom: 40,
    },
    cancelButton: {
        padding: 15,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        flex: 1,
        padding: 15,
        marginLeft: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    deleteButton: {
        flex: 1,
        padding: 15,
        marginLeft: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4444',
        elevation: 2,
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
