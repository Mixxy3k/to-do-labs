import Link from 'next/link';

export default function TaskFeed({ taskLists, admin}) {
  return taskLists ? taskLists.map(taskList => (<PostItem taskList={taskList} key={taskList.slug} admin={admin}/>)) : null;
}

function PostItem( {taskList, admin = false} ) {
  return (
    <div className="card">
      <Link href={`/${taskList.username}`}>
        <a>
          <strong> By @{taskList.username}</strong>
        </a>
      </Link>
      <div>
        <Link href={`/${taskList.username}/${taskList.slug}`}>
          <h2>
            <a>{taskList.title}</a>
          </h2>
        </Link>
      </div>

      <footer>
        <span>
          {taskList.amount} tasks | Created {msToDate(taskList.createdAt)}
        </span>
        <span className='push-left'> ⚡ {taskList.priority}</span>
      </footer>
    </div>
  );
}

function msToDate(ms) {
  const date = new Date(ms);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}