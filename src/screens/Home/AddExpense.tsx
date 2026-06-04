import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format, parse } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

import { addExpense, updateExpense, deleteExpense, ExpenseData } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import Loading from '../../components/atoms/Loading';
import { CATEGORIES, CATEGORY_COLORS } from '../../constants/categories';

const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

const parseExpenseDate = (dateString: string) =>
    parse(dateString, 'yyyy-MM-dd', new Date());

const sanitizeAmountInput = (value: string) => {
    const valueWithoutCommas = value.replace(/,/g, '');
    let nextValue = '';
    let hasDecimal = false;

    for (const char of valueWithoutCommas) {
        if (/\d/.test(char)) {
            nextValue += char;
            continue;
        }

        if (char === '.' && !hasDecimal) {
            nextValue += char;
            hasDecimal = true;
        }
    }

    const [integerPart, decimalPart] = nextValue.split('.');
    const normalizedInteger = integerPart.replace(/^0+(?=\d)/, '');

    if (decimalPart !== undefined) {
        return `${normalizedInteger || '0'}.${decimalPart.slice(0, 2)}`;
    }

    return normalizedInteger || (integerPart ? '0' : '');
};

const formatAmountForDisplay = (value: string) => {
    if (!value) return '';

    const [integerPart, decimalPart] = value.split('.');
    const formattedInteger = (integerPart || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (value.endsWith('.')) {
        return `${formattedInteger}.`;
    }

    if (decimalPart !== undefined) {
        return `${formattedInteger}.${decimalPart}`;
    }

    return formattedInteger;
};

const FIRESTORE_WRITE_TIMEOUT_MS = 5000;

const waitForFirestoreWrite = async (writePromise: Promise<void>) => {
    let timedOut = false;

    const handledWrite = writePromise.catch(error => {
        if (timedOut) {
            console.error('Expense write failed after modal closed:', error);
            return;
        }

        throw error;
    });

    await Promise.race([
        handledWrite,
        new Promise<void>(resolve => {
            setTimeout(() => {
                timedOut = true;
                resolve();
            }, FIRESTORE_WRITE_TIMEOUT_MS);
        }),
    ]);
};

const AddExpense = () => {
    const { themeColors, currentTheme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const expenseToEdit: ExpenseData | undefined = route.params?.expense;
    const initialCategory = route.params?.category;
    const initialDate: string | undefined = route.params?.initialDate;

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => initialDate || getTodayDateString());
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
        } else {
            setSelectedDate(initialDate || getTodayDateString());
            setCategory(initialCategory || '');
        }
    }, [expenseToEdit, initialCategory, initialDate]);

    const selectedDateLabel = useMemo(() => {
        return format(parseExpenseDate(selectedDate), 'dd MMM yyyy');
    }, [selectedDate]);

    const displayAmount = useMemo(() => {
        return formatAmountForDisplay(amount);
    }, [amount]);

    const handleSave = async () => {
        const amountValue = Number(amount);

        if (!amount.trim() || !description.trim() || !category) {
            Alert.alert('Error', 'Please fill in all fields (Amount, Description, and Category)');
            return;
        }

        if (!Number.isFinite(amountValue) || amountValue <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        let shouldClose = false;

        try {
            setIsSaving(true);
            const expenseDate = parseExpenseDate(selectedDate);

            if (expenseToEdit && expenseToEdit.id) {
                await waitForFirestoreWrite(updateExpense(expenseToEdit.id, amountValue, description, category, expenseDate));
            } else {
                await waitForFirestoreWrite(addExpense(amountValue, description, category, expenseDate));
            }

            shouldClose = true;
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Unable to save expense.');
        } finally {
            setIsSaving(false);

            if (shouldClose) {
                navigation.goBack();
            }
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
                        let shouldClose = false;

                        try {
                            setIsDeleting(true);
                            await waitForFirestoreWrite(deleteExpense(expenseToEdit.id!));
                            shouldClose = true;
                        } catch (error: any) {
                            Alert.alert('Error', error?.message || 'Unable to delete expense.');
                        } finally {
                            setIsDeleting(false);

                            if (shouldClose) {
                                navigation.goBack();
                            }
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
                        <Typography color="primary" size={16}>{selectedDateLabel}</Typography>
                    </TouchableOpacity>

                    <Typography color="secondary" size={14} style={styles.label}>Amount (MMK) <Typography color="error" size={14}>*</Typography></Typography>
                    <TextInput
                        placeholder="0"
                        placeholderTextColor={themeColors.text.secondary}
                        keyboardType="decimal-pad"
                        value={displayAmount}
                        onChangeText={(value) => setAmount(sanitizeAmountInput(value))}
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
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setShowDatePicker(false)}
                    />

                    <View style={[styles.modalContent, { backgroundColor: themeColors.card.fill1, borderColor: themeColors.navbar.borderColor }]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderText}>
                                <Typography size={18} style={styles.modalTitle}>Choose date</Typography>
                                <Typography size={13} color="secondary">{selectedDateLabel}</Typography>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowDatePicker(false)}
                                style={[styles.closeButton, { backgroundColor: themeColors.primary.primary0 + '14' }]}
                            >
                                <Icon name="close" size={20} color={themeColors.primary.primary0} />
                            </TouchableOpacity>
                        </View>

                        <Calendar
                            key={currentTheme}
                            current={selectedDate}
                            style={styles.modalCalendar}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: themeColors.primary.primary0 }
                            }}
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                                setShowDatePicker(false);
                            }}
                            renderArrow={(direction) => (
                                <Icon
                                    name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                                    size={22}
                                    color={themeColors.primary.primary0}
                                />
                            )}
                            theme={{
                                calendarBackground: themeColors.card.fill1,
                                textSectionTitleColor: themeColors.text.secondary,
                                dayTextColor: themeColors.text.primary,
                                monthTextColor: themeColors.text.primary,
                                arrowColor: themeColors.primary.primary0,
                                todayTextColor: themeColors.primary.primary0,
                                selectedDayBackgroundColor: themeColors.primary.primary0,
                                selectedDayTextColor: '#ffffff',
                                textDisabledColor: themeColors.grey.grey100,
                                textDayFontWeight: '500',
                                textMonthFontWeight: '700',
                                textDayHeaderFontWeight: '600',
                                textDayFontSize: 15,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 12,
                            }}
                            hideExtraDays
                            enableSwipeMonths
                        />
                    </View>
                </View>
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
        paddingHorizontal: 20,
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalHeaderText: {
        flex: 1,
        marginRight: 12,
    },
    modalTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCalendar: {
        borderRadius: 14,
    },
});
