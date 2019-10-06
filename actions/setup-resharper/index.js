const core = require('@actions/core');
const tc = require('@actions/tool-cache');

async function run() {
  try { 
    const resharperUrl = core.getInput('resharper-url');
    const resharperZipPath = await tc.downloadTool(resharperUrl);
    const resharperPath = await tc.extractZip(resharperZipPath, core.getInput('resharper-path'));
    const inspectCodeExe = `${resharperPath}\\inspectcode.exe`;

    core.setOutput('inspectcode-path', inspectCodeExe);
    core.setOutput('results-path', '.\\.output\\resharper');
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();