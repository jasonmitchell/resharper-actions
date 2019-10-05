const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

async function run() {
  try { 
    const resharperUrl = core.getInput('resharper-commandlinetools-url')
    const resharperZipPath = await tc.downloadTool(resharperUrl);
    const resharperPath = await tc.extractZip(resharperZipPath, core.getInput('resharper-path'));

    const resharperInspectPath = `${resharperPath}\\inspectcode.exe`;
    const solutionPath = core.getInput('solution-path');
    const outputPath = core.getInput('results-output-location');

    await exec.exec(`${resharperInspectPath} ${solutionPath} -o=${outputPath}\\inspect-results.xml`);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()