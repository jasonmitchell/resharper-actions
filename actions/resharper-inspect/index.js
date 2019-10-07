const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try { 

    const inspectCodePath = core.getInput('inspectcode-path');
    const resultsPath = core.getInput('results-path');
    const solutionPath = core.getInput('solution-path');
    const minimumSeverity = core.getInput('minimum-severity');
    const resultsXmlPath = `${resultsPath}\\inspect-results.xml`

    await exec.exec(`${inspectCodePath} ${solutionPath} -o=${resultsXmlPath} -s=${minimumSeverity}`);
    core.setOutput('results-xml-path', resultsXmlPath);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();