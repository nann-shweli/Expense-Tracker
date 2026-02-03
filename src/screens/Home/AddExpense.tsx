import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { addExpense, updateExpense, deleteExpense, ExpenseData } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';
import Loading from '../../components/atoms/Loading';

const AddExpense = () => {
    const { themeColors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const expenseToEdit: ExpenseData | undefined = route.params?.expense;

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (expenseToEdit) {
            setAmount(String(expenseToEdit.amount));
            setDescription(expenseToEdit.description);
            setCategory(expenseToEdit.category);
        }
    }, [expenseToEdit]);

    const handleSave = async () => {
        if (!amount || !description) {
            Alert.alert('Error', 'Please enter amount and description');
            return;
        }

        try {
            setIsSaving(true);
            const expenseDate = new Date();

            if (expenseToEdit && expenseToEdit.id) {
                await updateExpense(expenseToEdit.id, Number(amount), description, category);
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
