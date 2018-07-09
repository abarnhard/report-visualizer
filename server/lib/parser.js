const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

exports.parseReports = parseReports;

function parseReports() {
  const reportDir = process.env.REPORT_DIR;

  const nodes = {
    appParent: {
      group: 'nodes',
      data: {
        id: 'appParent',
      },
    },
  };
  const edges = [];

  reportNames = fs.readdirSync(reportDir);
  reportIds = [];

  reportNames.forEach((reportName) => {
    nodes[reportName] = {
      group: 'nodes',
      data: {
        parent: 'appParent',
      },
    };

    const reportId = path.basename(reportName, '.yml');
    reportIds.push(reportId);
  });

  reportNames.forEach((reportName) => {
    const reportYaml = fs.readFileSync(`${reportDir}/${reportName}`);

    const config = yaml.safeLoad(reportYaml, 'utf8');

    nodes[reportName].data.id = config.report.title;

    const matchString = `(${reportIds.join(')|(')})`;

    const regex = new RegExp(matchString, 'g');

    let match = regex.exec(config.report.sql);
    while (match) {
      edges.push({
        id: `${reportName}|${match[0]}`,
        source: path.basename(reportName, '.yml'),
        target: match[0],
      });

      match = regex.exec(config.report.sql);
    }
  });


  return { nodes, edges, reportIds };
}
