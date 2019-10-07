const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
  try { 

    const inspectCodePath = core.getInput('inspectcode-path');
    const resultsPath = core.getInput('results-path');
    const solutionPath = core.getInput('solution-path');
    const resultsXmlPath = `${resultsPath}\\inspect-results.xml`

    await exec.exec(`${inspectCodePath} ${solutionPath} -o=${resultsXmlPath}`);
    core.setOutput('results-xml-path', resultsXmlPath);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();