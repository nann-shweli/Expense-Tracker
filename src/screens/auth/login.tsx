import { StyleSheet, TouchableOpacity, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';

type NavigationProp = StackNavigationProp<any>;

const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const { top } = useSafeAreaInsets();
  const { setTheme, currentTheme, themeColors } = useTheme();

  const handlePress = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleSetting = () => {
    navigation.navigate('OTP');
  };

  return (
    <View style={[styles.container, {backgroundColor:themeColors.container.backgroundColor}]}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.themeButton, { top: top + 10 }]}
      >
        <Icon
          name={currentTheme === 'light' ? 'moon-outline' : 'sunny-outline'}
          size={28}
          color="red"
        />
      </TouchableOpacity>

      <View style={styles.center}>
        <Button title="Settings" onPress={handleSetting} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButton: {
    position: 'absolute',
    right: 10,
    zIndex: 100,
  },
});

export default Login;
