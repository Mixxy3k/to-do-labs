import Link from 'next/link';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="box-center">
        <h1>🎉 Welcome to To-Do 🎉</h1>
        <div>
          This is a simple To-Do app built with ➡️Next.js➡️ and 🔥Firebase🔥!<br />
          You can create a new task list 📃 and add tasks to it 🍕<br />
          To see your profile and all your tasks, click on your profile picture 🧑‍🎨 <br />
          What ever you do, you can always come back and see or edit your tasks 📊 <br />
          Sign in with Google and create your own list 🔥<br />
        </div>
        <div>
          <h2>Don&apos;t memorise everything 🧠 Have fun! 🎉</h2>
        </div>
      </div>
      <div className='centerIMG'>
        <Image src="/mainIMG.png" width={457} height={115} alt="Funny image"/>
      </div>
    </main>
)
}
