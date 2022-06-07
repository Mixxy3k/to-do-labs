import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function SignOutButton() {
  const router = useRouter();

  const _signOut = async () => {
    await signOut(auth)
    router.push('/');
  };

  return (
    <button onClick={_signOut}>Sign Out</button>
  )
}