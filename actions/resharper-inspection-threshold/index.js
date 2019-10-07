const core = require('@actions/core');
const fs = require('fs');

async function run() {
  try { 
    const summaryPath = core.getInput('results-summary-json-path');
    const errorThreshold = core.getInput('error-threshold');
    const warningThreshold = core.getInput('warning-threshold');

    fs.readFile(summaryPath, {encoding: 'utf-8'}, function(err, summaryJson){
      if (err) {
        throw err;
      }

      const summary = JSON.parse(summaryJson);
      if (errorThreshold && summary.severities.error > Number(errorThreshold)) {
        core.setFailed(`${summary.severities.error} Resharper errors were detected.  The acceptable threshold is ${errorThreshold}`)
      }

      if (warningThreshold && summary.severities.warning > Number(warningThreshold)) {
        core.setFailed(`${summary.severities.warning} Resharper warnings were detected.  The acceptable threshold is ${warningThreshold}`)
      }
    });
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();