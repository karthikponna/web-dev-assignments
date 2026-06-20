// Problem Description – Task Execution with Dependencies
//
// You are given a set of asynchronous tasks where some tasks depend
// on the completion of others.
// Your goal is to execute each task only after all of its dependencies
// have been successfully completed.
// The solution should ensure correct execution order and handle
// dependency relationships properly.
//
// Each task is asynchronous and must invoke a callback when finished.
// Invoke finalCallback after all tasks have completed, or with an error
// if any task fails.

function runWithDependencies(tasks, finalCallback) {
    const taskNames = Object.keys(tasks);

    if (taskNames.length === 0) {
        finalCallback(null);
        return;
    }

    const completed = {};
    const running = {};
    let completedCount = 0;
    let hasError = false;

    function tryRunTasks() {
        if (hasError) {
            return;
        }

        for (let i = 0; i < taskNames.length; i++) {
            const name = taskNames[i];
            const taskInfo = tasks[name];

            if (completed[name] || running[name]) {
                continue;
            }

            const dependencies = taskInfo.dependencies || [];

            const canRun = dependencies.every(function (dep) {
                return completed[dep];
            });

            if (canRun) {
                running[name] = true;

                taskInfo.task(function (err) {
                    if (hasError) {
                        return;
                    }

                    if (err) {
                        hasError = true;
                        finalCallback(err);
                        return;
                    }

                    completed[name] = true;
                    completedCount++;

                    if (completedCount === taskNames.length) {
                        finalCallback(null);
                        return;
                    }

                    tryRunTasks();
                });
            }
        }
    }

    tryRunTasks();
}

module.exports = runWithDependencies;