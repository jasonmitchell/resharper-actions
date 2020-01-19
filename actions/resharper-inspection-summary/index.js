const core = require('@actions/core');
const fs = require('fs');
const xml2js = require('xml2js');

function readIssueTypes(report) {
  const issueTypes = [];

  for (let i = 0; i < report.IssueTypes.length; i++) {
    for (let j = 0; j < report.IssueTypes[i].IssueType.length; j++) {
      const issueType = report.IssueTypes[i].IssueType[j].$;
      issueTypes.push(issueType);
    }
  }

  return issueTypes;
}

function createEmptySummary(issueTypes) {
  const summary = {
    severities: {
      error: 0,
      warning: 0,
      suggestion: 0,
      hint: 0
    },
    issueTypes: {}
  };

  for (let i = 0; i < issueTypes.length; i++) {
    const issueType = issueTypes[i];
    const severity = issueType.Severity.toLowerCase();

    summary.issueTypes[issueType.Id] = {
      severity: severity,
      category: issueType.Category,
      description: issueType.Description,
      count: 0
    };
  }

  return summary;
}

function countIssues(summary, issues) {
  for (let i = 0; i < issues.length; i++) {
    for (let j = 0; j < issues[i].Project.length; j++) {
      const projectIssues = issues[i].Project[j].Issue;

      for (let k = 0; k < projectIssues.length; k++) {
        const issue = projectIssues[k].$;
        const issueTypeSummary = summary.issueTypes[issue.TypeId];
        const severity = issueTypeSummary.severity

        summary.severities[severity] += 1;
        issueTypeSummary.count += 1;
      }
    }
  }
}

function summariseResults(report) {
  const issueTypes = readIssueTypes(report);
  const summary = createEmptySummary(issueTypes);
  countIssues(summary, report.Issues);

  return summary;
}

async function run() {
  try { 
    const resultsPath = core.getInput('results-path');
    const summaryJsonPath = `${resultsPath}\\inspection-summary.json`

    const resultsXmlPath = core.getInput('results-xml-path');
    
    fs.readFile(resultsXmlPath, {encoding: 'utf-8'}, function(err, resultsXml){
      if (err) {
        throw err;
      }

      const parser = new xml2js.Parser();
      parser.parseString(resultsXml, function (err, result) {
        if (err) {
          throw err;
        }
        
        const summary = summariseResults(result.Report);
        const summaryJson = JSON.stringify(summary, null, 2)

        fs.writeFile(summaryJsonPath, summaryJson, function(err) {
          if(err) {
              throw err;
          }

          console.log("Summary:")
          console.log(summaryJson);

          core.setOutput('errors', summary.severities.error);
          core.setOutput('warnings', summary.severities.warning);
          core.setOutput('suggestions', summary.severities.suggestion);
          core.setOutput('hints', summary.severities.hint);
          core.setOutput('results-summary-json-path', summaryJsonPath);
        });
      });
    });
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
