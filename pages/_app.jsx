import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserData } from '../lib/hooks';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  
  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
