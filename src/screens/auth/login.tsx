import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';

import { useTheme } from '../../hooks/useTheme';
import { loginWithEmail, signUpWithEmail } from '../../services/auth/firebaseAuth';


const Login = () => {
  const { top } = useSafeAreaInsets();
  const { setTheme, currentTheme, themeColors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };
const handleEmailAuth = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter email and password');
    return;
  }

  try {
    setLoading(true);

    if (isRegister) {
      await signUpWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }

  } catch (e: any) {
    Alert.alert('Authentication failed', e.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.container.backgroundColor },
      ]}
    >
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.themeButton, { top: top + 10 }]}
      >
        <Icon
          name={currentTheme === 'light' ? 'moon-outline' : 'sunny-outline'}
          size={26}
          color={themeColors.text.primary}
        />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={[styles.title, { color: themeColors.text.primary }]}>
          {isRegister ? 'Create Account' : 'Welcome'}
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={themeColors.text.secondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            {
              color: themeColors.text.primary,
              borderColor: themeColors.text.primary 
            },
          ]}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={themeColors.text.secondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            styles.input,
            {
              color: themeColors.text.primary,
              borderColor: themeColors.text.primary 
            },
          ]}
        />

        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: themeColors.text.primary  },
          ]}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>
              {isRegister ? 'Register' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsRegister(!isRegister)}
          disabled={loading}
        >
          <Text
            style={{
              marginTop: 16,
              color: themeColors.text.secondary,
            }}
          >
            {isRegister
              ? 'Already have an account? Login'
              : 'No account? Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  themeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 32,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  loginButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
