const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

exports.parseReports = parseReports;

function parseReports() {
  const reportDir = process.env.REPORT_DIR;

  let nodes = {};
  let edges = {};

  reportNames = fs.readdirSync(reportDir);
  reportIds = [];

  reportNames.forEach((reportName) => {
    const reportId = path.basename(reportName, '.yml');

    nodes[reportId] = {
      data: {},
      isRoot: true,
    };

    reportIds.push(reportId);
  });

  reportNames.forEach((reportName) => {
    const reportYaml = fs.readFileSync(`${reportDir}/${reportName}`);
    const reportId = path.basename(reportName, '.yml');
    const config = yaml.safeLoad(reportYaml, 'utf8');

    nodes[reportId].data.id = config.report.id;

    const matchString = `(${reportIds.join(')|(')})`;

    const regex = new RegExp(matchString, 'g');

    let match = regex.exec(config.report.sql);
    while (match) {
      const targetId = match[0];

      if (!nodes[targetId]) {
        console.log(`Node id ${targetId} not found`);
        match = regex.exec(config.report.sql);
        continue;
      }

      const edgeId = `${reportId}|${targetId}`;
      edges[edgeId] = {
        data: {
          id: edgeId,
          source: path.basename(reportName, '.yml'),
          target: targetId,
        },
      }

      nodes[targetId].isRoot = false;

      match = regex.exec(config.report.sql);
    }
  });

  let roots = [];
  nodes = Object.keys(nodes).map((nodeId) => {
    const node = nodes[nodeId];

    if (node.isRoot) { roots.push(nodeId); }

    return {
      data: node.data,
    }
  });

  roots = `#${roots.join(',#')}`;

  edges = Object.keys(edges).map(edgeId => edges[edgeId]);

  return { nodes, edges, roots };
}
