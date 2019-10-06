const core = require('@actions/core');
const tc = require('@actions/tool-cache');

async function run() {
  try { 
    const resharperVersion = core.getInput('resharper-version');
    const resharperUrl = `https://download.jetbrains.com/resharper/ReSharperUltimate.${resharperVersion}/JetBrains.ReSharper.CommandLineTools.${resharperVersion}.zip`;
    const resharperZipPath = await tc.downloadTool(resharperUrl);
    const resharperPath = await tc.extractZip(resharperZipPath, core.getInput('resharper-path'));

    const inspectCodeExe = `${resharperPath}\\inspectcode.exe`;
    await tc.cacheFile(inspectCodeExe, 'resharper-inspectcode.exe', 'resharper-inspectcode', resharperVersion);

    core.setOutput('inspectcode-path', inspectCodeExe);
    core.setOutput('results-path', '.\\.output\\resharper');
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();