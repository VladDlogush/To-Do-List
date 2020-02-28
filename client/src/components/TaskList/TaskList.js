import React from 'react';
import PropTypes from 'prop-types';
import Task from '../Task/Task';
import styles from './TaskList.module.css';

const TaskList = ({
  items,
  deleteTask,
  updateCompleted,
  updatePriority,
  onEdit,
}) =>
  items.length > 0 && (
    <ul className={styles.list}>
      {items.map(item => (
        <li key={item.id}>
          <Task
            {...item}
            deleteTask={() => deleteTask(item.id)}
            updateCompleted={() => updateCompleted(item.id)}
            updatePriority={updatePriority}
            onEdit={() => onEdit(item.id)}
          />
        </li>
      ))}
    </ul>
  );

TaskList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default TaskList;
