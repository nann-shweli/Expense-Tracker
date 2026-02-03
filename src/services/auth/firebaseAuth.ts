
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // TODO: Get this from Google Cloud Console
});

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

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log('User cancelled the login flow');
          throw new Error('User cancelled the login flow');
        case statusCodes.IN_PROGRESS:
          console.log('Sign in is in progress');
          throw new Error('Sign in is in progress');
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play services not available or outdated');
          throw new Error('Play services not available or outdated');
        default:
          console.log('Some other error happened', error);
          throw error;
      }
    } else {
      // an error that's not related to google sign in occurred
      console.log('An error that\'s not related to google sign in occurred', error);
      throw error;
    }
  }
};

export const logout = async () => {
  await auth().signOut();
  await GoogleSignin.signOut();
};
