'use strict';

axios.get('/graph').then((resp) => {
  console.log(resp.data);
  window.data = resp.data;

  var cy = cytoscape({
    container: document.getElementById('root'),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(id)'
        })
      .selector('edge')
        .css({
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width': 4,
          'line-color': '#ddd',
          'target-arrow-color': '#ddd'
        })
      .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }),

    elements: {
      nodes: resp.data.nodes,
      edges: resp.data.edges,
    },
    layout: {
      name: 'breadthfirst',
      directed: false,
      // roots: resp.data.roots,
      padding: 10
    }
  });
});
