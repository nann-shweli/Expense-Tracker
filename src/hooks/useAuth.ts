import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged(currentUser => {
    setUser(currentUser);
    setLoading(false);
  });

  return unsubscribe;
}, []);

  return { user, loading };
};
