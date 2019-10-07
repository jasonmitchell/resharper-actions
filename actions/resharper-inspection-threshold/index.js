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

      const errorCount = summary.severities.error || 0;
      if (errorThreshold && errorCount > Number(errorThreshold)) {
        core.setFailed(`${errorCount} Resharper errors were detected.  The acceptable threshold is ${errorThreshold}`)
      }

      const warningCount = summary.severities.warning || 0;
      if (warningThreshold && warningCount > Number(warningThreshold)) {
        core.setFailed(`${warningCount} Resharper warnings were detected.  The acceptable threshold is ${warningThreshold}`)
      }
    });
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();