import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addExpense } from '../../services/firestore';
import Typography from '../../components/atoms/Typography';
import { useTheme } from '../../hooks/useTheme';

const AddExpense = () => {
    const { themeColors } = useTheme();
    const navigation = useNavigation();

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);

    const handleAddExpense = async () => {
        if (!amount || !description) {
            Alert.alert('Error', 'Please enter amount and description');
            return;
        }

        try {
            setLoading(true);
            const expenseDate = new Date();

            await addExpense(Number(amount), description, category, expenseDate);
            setLoading(false);

            // Navigate back
            setTimeout(() => {
                navigation.goBack();
            }, 100);

        } catch (error: any) {
            setLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.container.backgroundColor }]}>
            <View style={styles.content}>
                <Typography size={24} style={styles.title}>Add Expense</Typography>

                <TextInput
                    placeholder="Amount"
                    placeholderTextColor={themeColors.text.secondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    style={[styles.input, { color: themeColors.text.primary, borderColor: themeColors.text.secondary }]}
                    autoFocus={true}
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

                    <TouchableOpacity
                        onPress={handleAddExpense}
                        style={[styles.saveButton, { backgroundColor: themeColors.primary.primary0 }]}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Typography style={{ color: '#fff' }}>Save</Typography>}
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
});
