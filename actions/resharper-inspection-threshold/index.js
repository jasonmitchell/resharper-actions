const core = require('@actions/core');

async function run() {
  try { 
    const summary = JSON.parse(core.getInput('results-summary-json'));
    const errorThreshold = Number(core.getInput('error-threshold'));
    const warningThreshold = Number(core.getInput('warning-threshold'));

    if (summary.severities.error > errorThreshold) {
      core.setFailed(`${summary.severities.error} Resharper errors were detected.  The acceptable threshold is ${errorThreshold}`)
    }

    if (summary.severities.warning > warningThreshold) {
      core.setFailed(`${summary.severities.warning} Resharper warnings were detected.  The acceptable threshold is ${warningThreshold}`)
    }
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();