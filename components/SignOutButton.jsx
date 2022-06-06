import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function SignOutButton() {
  const _signOut = async () => {
    await signOut(auth)
  };

  return (
    <button onClick={_signOut}>Sign Out</button>
  )
}