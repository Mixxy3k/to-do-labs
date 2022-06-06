import UserProfile from "../../components/UserProfile"
import TaskFeed from "../../components/TaskFeed"
import { firestore, getUserWithUsername, postToJson } from "../../lib/firebase"
import { collection, getDocs, orderBy, query as firebaseQuery } from "firebase/firestore";


export async function getServerSideProps( {query} ) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null
  let taskLists = null;

  if (userDoc) {
    user = userDoc.data();
    const q = firebaseQuery(collection(firestore, `users/${userDoc.id}/task-lists`),
                            orderBy("createdAt", "desc"));


    const querySnapshot = await getDocs(q);
    taskLists = querySnapshot.docs.map(postToJson);
  }

  return {
    props: { user, taskLists }
  };
}


export default function UserPage({ user, taskLists }) {
  return (
    <>
      <UserProfile user={user} />
      <TaskFeed taskLists={taskLists} />
    </>
  )
}