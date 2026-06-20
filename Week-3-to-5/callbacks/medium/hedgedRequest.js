// Problem Description – Hedged Request
//
// You have a Primary async source and a Secondary backup.
// Start the Primary immediately. If it is slow, start the Secondary.
//
// Return the first successful result and ignore the rest.
// Only fail if both fail, and ensure the callback runs once.
//
// Requirements:
// - Start Primary immediately.
// - Start Secondary after timeoutMs if needed.
// - First success wins.
// - Callback must be called exactly once.

function hedgedRequest(primary, secondary, timeoutMs, onComplete) {
    let completed = false;
    let primaryFailed = false;
    let secondaryFailed = false;
    let primaryError;
    let secondaryError;
    let secondaryStarted = false;

    function finish(err, result) {
        if (completed) {
            return;
        }

        completed = true;
        onComplete(err, result);
    }

    primary(function (err, result) {
        if (completed) {
            return;
        }

        if (!err) {
            finish(null, result);
            return;
        }

        primaryFailed = true;
        primaryError = err;

        if (secondaryFailed) {
            finish(primaryError || secondaryError);
        }
    });

    setTimeout(function () {
        if (completed || secondaryStarted) {
            return;
        }

        secondaryStarted = true;

        secondary(function (err, result) {
            if (completed) {
                return;
            }

            if (!err) {
                finish(null, result);
                return;
            }

            secondaryFailed = true;
            secondaryError = err;

            if (primaryFailed) {
                finish(primaryError || secondaryError);
            }
        });
    }, timeoutMs);
}

module.exports = hedgedRequest;