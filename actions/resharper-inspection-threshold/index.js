const core = require('@actions/core');

async function run() {
  try { 
    const summary = JSON.parse(core.getInput('results-summary-json'));
    const errorThreshold = core.getInput('error-threshold');
    const warningThreshold = core.getInput('warning-threshold');

    if (errorThreshold && summary.severities.error > Number(errorThreshold)) {
      core.setFailed(`${summary.severities.error} Resharper errors were detected.  The acceptable threshold is ${errorThreshold}`)
    }

    if (warningThreshold && summary.severities.warning > Number(warningThreshold)) {
      core.setFailed(`${summary.severities.warning} Resharper warnings were detected.  The acceptable threshold is ${warningThreshold}`)
    }
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();