import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, onSnapshot } from 'firebase/firestore';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
        const ref = collection(firestore, 'users')
        unsubscribe = onSnapshot(ref, (doc) => {
            doc.forEach(userDoc => {
                if (userDoc.id === user.uid) {
                    setUsername(userDoc.data()?.username);
                }
            });
        });
    } else {
        setUsername(null);
    }

    return unsubscribe;
    }, [user]);

    return { user, username };
}