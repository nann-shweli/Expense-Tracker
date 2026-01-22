import auth from '@react-native-firebase/auth';

export const signUpWithEmail = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(
    email.trim(),
    password
  );
};

export const loginWithEmail = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(
    email.trim(),
    password
  );
};

export const logout = async () => {
  await auth().signOut();
};
