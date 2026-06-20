// Problem Description – Ordered Parallel Batcher
//
// You need to process many items in parallel, but with a fixed
// concurrency limit to avoid resource exhaustion.
//
// Tasks should start as soon as a slot is free, and the final
// results must preserve the original input order.
//
// Requirements:
// - Run at most `limit` workers in parallel.
// - Preserve the original order of results.
// - Start new work as soon as one finishes.
// - Stop and return an error if any task fails.

function batchProcess(items, limit, worker, onComplete) {
    if (items.length === 0) {
        onComplete(null, []);
        return;
    }

    let results = new Array(items.length);
    let currentIndex = 0;
    let completed = 0;
    let running = 0;
    let hasError = false;

    function runNext() {
        if (hasError) {
            return;
        }

        while (running < limit && currentIndex < items.length) {
            const index = currentIndex;
            const item = items[currentIndex];

            currentIndex++;
            running++;

            worker(item, function (err, result) {
                running--;

                if (hasError) {
                    return;
                }

                if (err) {
                    hasError = true;
                    onComplete(err);
                    return;
                }

                results[index] = result;
                completed++;

                if (completed === items.length) {
                    onComplete(null, results);
                    return;
                }

                runNext();
            });
        }
    }

    runNext();
}

module.exports = batchProcess;