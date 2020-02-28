import React, { Component } from 'react';
import Notyf from 'notyf-js';
import TaskEditor from './TaskEditor/TaskEditor';
import TaskList from './TaskList/TaskList';
import TaskFilter from './TaskFilter/TaskFilter';
import Priority from '../utils/Priority';
import Legend from './Legend/Legend';
import Modal from './Modal/Modal';
import * as TaskAPI from '../services/task-api';
import 'notyf-js/dist/notyf.min.css';

const notyf = new Notyf();

const containerStyles = {
  maxWidth: 1200,
  minWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
};

const headerStyles = { display: 'flex', justifyContent: 'space-between' };

const legendOptions = [
  { priority: Priority.LOW, color: '#f44336' },
  { priority: Priority.NORMAL, color: '#2196f3' },
  { priority: Priority.HIGH, color: '#4caf50' },
];

const filterTasks = (tasks, filter) => {
  return tasks.filter(task =>
    task.text.toLowerCase().includes(filter.toLowerCase()),
  );
};

export default class App extends Component {
  state = {
    tasks: [],
    filter: '',
    isCreating: false,
    isEditing: false,
    selectedTaskId: null,
  };

  // Get tasks
  componentDidMount() {
    TaskAPI.fetchTasks().then(tasks => {
      this.setState({ tasks });
    });
  }

  // Create task
  addTask = task => {
    const newTask = {
      ...task,
      completed: false,
    };

    TaskAPI.postTask(newTask)
      .then(addedTask => {
        this.setState(state => ({
          tasks: [...state.tasks, addedTask],
        }));
      })
      .finally(this.closeCreateTaskModal());

    notyf.confirm('Your task successfully added!');
  };

  openCreateTaskModal = () => {
    this.setState({
      isCreating: true,
    });
  };

  closeCreateTaskModal = () => {
    this.setState({
      isCreating: false,
    });
  };

  // Delete task
  deleteTask = id => {
    TaskAPI.deleteTask(id).then(() => {
      this.setState(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }));
    });

    notyf.confirm('Your task successfully deleted!');
  };

  // Update task
  updateCompleted = id => {
    const task = this.state.tasks.find(t => t.id === id);

    TaskAPI.updateTask(id, { completed: !task.completed }).then(updatedTask => {
      this.setState(state => ({
        tasks: state.tasks.map(t => (t.id === id ? updatedTask : t)),
      }));
    });
  };

  updateTask = ({ text, priority }) => {
    TaskAPI.updateTask(this.state.selectedTaskId, { text, priority }).then(
      udpatedTask => {
        this.setState(
          state => ({
            tasks: state.tasks.map(task =>
              task.id === state.selectedTaskId ? udpatedTask : task,
            ),
          }),
          this.closeEditTaskModal,
        );
      },
    );
    notyf.confirm('Your changes have been successfully saved!');
  };

  changeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  openEditTaskModal = id => {
    this.setState({
      isEditing: true,
      selectedTaskId: id,
    });
  };

  closeEditTaskModal = () => {
    this.setState({
      isEditing: false,
      selectedTaskId: null,
    });
  };

  render() {
    const { tasks, filter, isCreating, isEditing, selectedTaskId } = this.state;
    const filteredTasks = filterTasks(tasks, filter);
    const taskInEdit = tasks.find(task => task.id === selectedTaskId);

    return (
      <div style={containerStyles}>
        <header style={headerStyles}>
          <button type="button" onClick={this.openCreateTaskModal}>
            Add task
          </button>
          <Legend items={legendOptions} />
        </header>
        <hr />
        <TaskFilter value={filter} changeFilter={this.changeFilter} />
        <TaskList
          items={filteredTasks}
          deleteTask={this.deleteTask}
          updateCompleted={this.updateCompleted}
          updatePriority={this.updatePriority}
          onEdit={this.openEditTaskModal}
        />
        {isCreating && (
          <Modal onClose={this.closeCreateTaskModal}>
            <TaskEditor
              onSave={this.addTask}
              onCancel={this.closeCreateTaskModal}
            />
          </Modal>
        )}
        {isEditing && (
          <Modal onClose={this.closeEditTaskModal}>
            <TaskEditor
              onSave={this.updateTask}
              onCancel={this.closeEditTaskModal}
              text={taskInEdit.text}
              priority={taskInEdit.priority}
            />
          </Modal>
        )}
      </div>
    );
  }
}
