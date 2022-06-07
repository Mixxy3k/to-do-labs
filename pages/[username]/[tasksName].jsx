import AuthCheck from '../../components/AuthCheck';
import Link from 'next/dist/client/link';
import CreateTaskModal from '../../components/CreateTaskModal';
import { getUserWithUsername, firestore } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { collection, getDocs, orderBy, query as firebaseQuery, doc, getDoc, setDoc, deleteDoc, updateDoc, increment } from "firebase/firestore";
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import kebabCase from 'lodash.kebabcase';
import { UserContext } from '../../lib/context';

export default function TaskPage(props) {
  return (
    <AuthCheck>
      <TaskList />
    </AuthCheck>
  );
}

function TaskList({}) {
  const router = useRouter();
  const { username, tasksName } = router.query;
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [update, setUpdate] = useState(true);
  useEffect(() => {
    async function getTasks(taskName, username) {
      const userDoc = await getUserWithUsername(username);
    
      const q = firebaseQuery(collection(firestore, `users/${userDoc.id}/task-lists/${taskName}/tasks`),
                              orderBy("priority", "desc"));
    
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.empty);
      setTasks([]);
      querySnapshot.forEach(doc => {
        setTasks(tasks => [...tasks, JSON.stringify(doc.data())]);
      });

      const taskRef = doc(firestore, `users/${userDoc.id}/task-lists/${taskName}`);
      const docSnapshot = await getDoc(taskRef);
      setTitle(docSnapshot.data().title);
      console.log("Firebase read!");
    }
    if (username && tasksName && update) {
      getTasks(tasksName, username);
      setUpdate(false);
    }
  }, [update]);

  return (
    <div>
      <div className='box-center'>
        <h1 className='task-header'>{title}</h1>
        <a className='task-owner'>
          <strong> Owner @{username}</strong>
        </a>
        <CreateTaskForm setUpdate={setUpdate}/>
      </div>
      {tasks.map(task => (
        <div key="task.id">
          <TaskItem task={JSON.parse(task)} admin={true}/>
        </div>
      ))}
    </div>
  )
}

function TaskItem({ task, admin = false }) {
  return (
    <div className="card">
      <Link href={`/${task.username}`}>
        <a>
          <strong> By @{task.username}</strong>
        </a>
      </Link>
      <h2>
        <a>{task.name}</a>
      </h2>
      <footer>
        <span>
          {task.content}
        </span>
        <span className='push-left'>⚡{task.priority}</span>
      </footer>
    </div>
  );
}

function CreateTaskForm({setUpdate}) {
  const [show , setShow] = useState(false);
  const { username } = useContext(UserContext)
  const router = useRouter();
  const { tasksName } = router.query;

  const onClose = () => {
    setShow(false);
  }

  const onCreate = () => {
    setShow(true);
  }

  const onSubmit = async (title, content, priority) => {
    if(title === '' || title === undefined || title === null) {
      toast.error('Task name is required');
      return;
    }

    const userDoc = await getUserWithUsername(username);
    const taskRef = doc(firestore, `users/${userDoc.id}/task-lists/${tasksName}/tasks/${kebabCase(title)}`);
    const task = {
      name: title,
      content: content,
      priority: +priority,
      username: username,
    }

    await setDoc(taskRef, task);

    //update task amount
    const taskListRef = doc(firestore, `users/${userDoc.id}/task-lists/${tasksName}`);
    updateDoc(taskListRef, {amount: increment(1)});
    toast.success('Task created!');
    setShow(false);
    setUpdate(true);
  }

  const deleteList = async () => {
    const userDoc = await getUserWithUsername(username);
    const taskRef = doc(firestore, `users/${userDoc.id}/task-lists/${tasksName}`);
    const docSnapshot = await getDoc(taskRef);
    await deleteDoc(docSnapshot.ref);

    const tasksRef = collection(firestore, `users/${userDoc.id}/task-lists/${tasksName}/tasks`);
    const tasksSnapshot = await getDocs(tasksRef);
    tasksSnapshot.forEach(doc => {
      deleteDoc(doc.ref);
    });
  }
  return (
    <>    
      {show && <CreateTaskModal onClose={onClose} onSubmit={onSubmit}/>}
      <div className='btns-tasks'>
        <button className='btn-green' onClick={onCreate}>Create Task</button>
        <button className='btn-red' onClick={deleteList}>Delete List</button>
      </div>
    </>
  )
}