import { useState } from "react";

export default function CreateTaskModal({onClose, onSubmit}) {
  const [title, setTitle] = useState('Title');
  const [content, setContent] = useState('Example content');
  const [priority, setPriority] = useState(1);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  }

  const onChangeContent = (e) => {
    setContent(e.target.value);
  }

  const onChangePriority = (e) => {
    setPriority(e.target.value);
  }

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="title">
          <h1>Create Task</h1>
        </div>
        <div className="body">
          <form className="createTaskForm">
            <input className="taskTitleForm" type="text" placeholder="Task name" value={title} onChange={onChangeTitle}/>
            <textarea className="taskContentForm" placeholder="Task description" rows="5" cols="50" value={content} onChange={onChangeContent}/>
            <div className="priority">
                <label>Priority</label>
                <select value={priority} onChange={onChangePriority}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
          </form>
        </div>
        <div className="footer">
          <button onClick={() => (onSubmit(title, content, priority))} className="btn-green">Create</button>
          <button onClick={onClose} className="btn-blue">Cancel</button>
        </div>
      </div>
    </div>
  );
}