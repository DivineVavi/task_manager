import React from 'react';
import Task from './Task.js';
import PropTypes from 'prop-types';
import { TaskContext } from './../context';

export default class Column extends React.Component {
    render() {
        const { Consumer: TaskConsumer } = TaskContext;
        const { columnTitle, ogr, className, id } = this.props;

        return (
            <div className={className}>
                <h2>{columnTitle}</h2>
                <p>Tasks ogr: {ogr}</p>
                <TaskConsumer>
                    {(context) => this.generateTaskList(context, id)}
                </TaskConsumer>
            </div>
        );
    }

    generateTaskList = (context, columnId) => {
        return context.tasks
            .filter(task => task.id_col === columnId)
            .map(task => (
                <Task
                    key={task.id}
                    item={task}
                    moveTask={context.moveTask}
                    moveBackTask={context.moveBackTask}
                    removeTask={context.removeTask}
                />
            ));
    }
}

Column.propTypes = {
    columnTitle: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    ogr: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired
};