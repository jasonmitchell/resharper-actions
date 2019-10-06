const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try { 
    const inspectCodePath = core.getInput('inspectcode-path')
    const solutionPath = core.getInput('solution-path');

    await exec.exec(`${inspectCodePath} ${solutionPath} -o=${outputPath}\\inspect-results.xml`);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()