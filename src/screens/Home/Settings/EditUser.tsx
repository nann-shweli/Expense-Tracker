import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import FormContainer from '../../../components/atoms/FormContainer';
import Typography from '../../../components/atoms/Typography';
import { useTheme } from '../../../hooks/useTheme';
import Loading from '../../../components/atoms/Loading';

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof schema>;

const EditUser = () => {
  const { themeColors } = useTheme();
  const navigation = useNavigation();
  const user = auth().currentUser;

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await user?.updateProfile({
        displayName: data.displayName,
      });
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(user.email);
      setLoading(false);
      Alert.alert('Email Sent', `Password reset email sent to ${user.email}`);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await user?.delete();
              setLoading(false);
            } catch (error: any) {
              setLoading(false);
              Alert.alert('Error', 'Please log in again to delete your account.');
            }
          },
        },
      ]
    );
  };

  return (
    <FormContainer>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: '#6C8792' }]}>
          <Icon name="person" size={50} color={'#FFFFFF'} />
        </View>
        <Typography size={18} style={styles.emailText}>
          {user?.email}
        </Typography>
      </View>

      <View style={styles.formSection}>
        <Typography style={styles.label}>Display Name</Typography>
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text.primary,
                  borderColor: themeColors.text.primary,
                },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Display Name"
              placeholderTextColor={themeColors.text.secondary}
            />
          )}
        />
        {errors.displayName && (
          <Typography color="#ff4444" size={12} style={styles.errorText}>
            {errors.displayName.message}
          </Typography>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "pink" }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <Loading />
        ) : (
          <Typography color="#fff" style={styles.buttonText}>
            Update Profile
          </Typography>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.outlineButton, { borderColor: themeColors.text.primary }]}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Typography style={styles.outlineButtonText}>Change Password</Typography>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.dangerButton]}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        <Typography color="#fff" style={styles.buttonText}>
          Delete Account
        </Typography>
      </TouchableOpacity>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailText: {
    opacity: 0.7,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: '600',
  },
  outlineButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  outlineButtonText: {
    fontWeight: '600',
  },
  dangerButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 24,
    opacity: 0.3,
  },
});

export default EditUser;
