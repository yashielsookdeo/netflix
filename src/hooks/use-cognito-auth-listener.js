import { useState, useEffect, useContext } from 'react';
import { CognitoContext } from '../context/cognito';

export default function useCognitoAuthListener() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));
  const { cognitoAuth } = useContext(CognitoContext);

  useEffect(() => {
    const unsubscribe = cognitoAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [cognitoAuth]);

  return { user };
}
