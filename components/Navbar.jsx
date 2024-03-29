import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import SignOutButton from './SignOutButton';
import Image from 'next/image';

export default function Navbar({ }) {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      {/* Logo */}
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">
              To-Do
            </button>
          </Link>
        </li>

      {/* if user is signed in */}
      {username && (
        <>
          <li className='push-left'>
            <Link href={`/admin`} className="hideOnMobile">
              <button className='btn-blue'>Create List</button>
            </Link>
          </li>
          <li>
            <SignOutButton />
          </li>
          <li>
            <Link href={`/${username}`}>
              <Image src={user?.photoURL} alt="User pfp" width={40} height={40}/>
            </Link>
          </li>
        </>
      )}

      {/* if user is not signed in */}
      {!username && (
        <li>
          <Link href="/enter">
            <button className="btn-blue">Sign in</button>
          </Link>
        </li>
      )}
      </ul>
    </nav>
  )
}