import React from 'react';
import PropTypes from 'prop-types';
import styles from './TaskFilter.module.css';

const TaskFilter = ({ value, changeFilter }) => (
  <input
    type="text"
    className={styles.input}
    value={value}
    onChange={changeFilter}
    placeholder="Type to filter tasks..."
  />
);

TaskFilter.propTypes = {
  value: PropTypes.string.isRequired,
  changeFilter: PropTypes.func.isRequired,
};

export default TaskFilter;
