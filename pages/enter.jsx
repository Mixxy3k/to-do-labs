import { auth, firestore, googleAuthProvider } from "../lib/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { doc, getDoc, writeBatch } from "firebase/firestore"
import { UserContext } from "../lib/context"
import { useCallback, useContext, useEffect, useState } from "react"
import SignOutButton from "../components/SignOutButton"
import Loader from "../components/Loader"
import debounce from "lodash.debounce"

export default function EnterPage({props}) {
  const {user, username} = useContext(UserContext)

  return (
    <main>
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
  </main>
  )
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
  };

  return (
    <button onClick={signInWithGoogle} className="btn-google">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="30px"/>
      Sign in with Google
    </button>
  )
}

function UsernameForm() {
  const {user, username} = useContext(UserContext)

  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(firestore, `users/${user.uid}`)
    const usernameDoc = doc(firestore, `usernames/${formValue}`)

    const bath = writeBatch(firestore)
    bath.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName})
    bath.set(usernameDoc, {uid: user.uid})

    await bath.commit()
    console.log("Firebase write executed")
  }

  const onChange = (e) => {
    const val = e.target.value
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);
  
  const checkUsername = useCallback(debounce(async (username) => {
    if (username.length >= 3 ) {
      const userRef = doc(firestore, `users/${username}`)
      const docSnapshot = await getDoc(userRef)
      console.log("Firebase read executed")
      setIsValid(!docSnapshot.exists())
      setLoading(false)
    }
  }, 500), []);

  return (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input  type="text" placeholder="username" name="username" 
                value={formValue} onChange={onChange} />
        <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
        <button type="submit" className="btn-green" disabled={!isValid}>Submit</button>
        <Loader show={loading} />
      </form>
    </section>
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}