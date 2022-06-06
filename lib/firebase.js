import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, query, limit, getDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeKmmlvNi-5uXSabFBPjX7Bxjr2Hq4Fz8",
  authDomain: "to-do-labs.firebaseapp.com",
  projectId: "to-do-labs",
  storageBucket: "to-do-labs.appspot.com",
  messagingSenderId: "882039381320",
  appId: "1:882039381320:web:e4b15edc9ba7c63bc0a77d",
  measurementId: "G-VDTW117X02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);

export async function  getUserWithUsername(username) {
  const q = query(collection(firestore, "users"),
                  where("username", "==", username),
                  limit(1))
  const userDoc = await getDocs(q)
  return userDoc.docs[0]
}

export function postToJson(doc) {
  const data = doc.data();
  return {
    ...data,

    createdAt: data.createdAt.toMillis(),
  };
}