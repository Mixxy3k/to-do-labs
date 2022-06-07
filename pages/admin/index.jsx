import AuthCheck from "../../components/AuthCheck"
import kebabCase from "lodash.kebabcase";
import CreateListModal from "../../components/CreateListModal";
import { useRouter } from 'next/router';
import { getUserWithUsername, firestore } from "../../lib/firebase";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { UserContext } from "../../lib/context";
import { useContext } from "react";
import toast from 'react-hot-toast';


export default function AdminPage(props) {
  return (
    <main>
        <AuthCheck>
          <CreateTask />            
        </AuthCheck>
    </main>
  )
}

function CreateTask() {
  const router = useRouter();
  const {username} = useContext(UserContext);
  const onSubmit = async (title, content, priority) => {
    if(title === '' || title === undefined || title === null) {
      toast.error('Task name is required');
      return;
    }

    const userDoc = await getUserWithUsername(username);
    const taskRef = doc(firestore, `users/${userDoc.id}/task-lists/${kebabCase(title)}`);
    const taskList = {
      title: title,
      slug: kebabCase(title),
      uid: userDoc.id,
      username: username,
      content: content,
      priority: +priority,
      amount: 0,
      createdAt: serverTimestamp(),
    }
    console.log(taskList);

    await setDoc(taskRef, taskList);
    toast.success('Task List created!');
    router.push(`/${username}/${kebabCase(title)}`);
  }

  const onClose = () => {
    router.push(`/${username}`);
  }
  return (
    <main>
      <CreateListModal onClose={onClose} onSubmit={onSubmit} />
    </main>
  );
}