
/**
 * Dependencies
 */

var _ = require('underscore');

/**
 *  An graph representing the underlying 'wireframe' network
 */

function NetworkGraph() {
  this.vertices = [];
  this.edges = [];
}

NetworkGraph.prototype.addVertex = function(stop, x, y) {
  if (!x) {
    x = stop.stop_lon;
  }
  if (!y) {
    y = stop.stop_lat;
  }
  var vertex = new Vertex(stop, x, y);
  this.vertices.push(vertex);
  return vertex;
};

NetworkGraph.prototype.addEdge = function(stopArray, fromVertex, toVertex) {
  if(!_.contains(this.vertices, fromVertex)) {
    console.log('Error: NetworkGraph does not contain Edge fromVertex');
    return;
  }
  if(!_.contains(this.vertices, toVertex)) {
    console.log('Error: NetworkGraph does not contain Edge toVertex');
    return;
  }
  var edge = new Edge(stopArray, fromVertex, toVertex);
  this.edges.push(edge);
  fromVertex.edges.push(edge);
  toVertex.edges.push(edge);
  return edge;
};

NetworkGraph.prototype.getEquivalentEdge = function(stopArray, fromVertex, toVertex) {
  for(var e = 0; e < this.edges.length; e++) {
    var edge = this.edges[e];
    if(edge.fromVertex !== fromVertex || edge.toVertex !== toVertex || stopArray.length !== edge.stopArray.length) continue;
    var matches = 0;
    for(var s = 0; s < stopArray.length; s++) {
      if(stopArray[s] === edge.stopArray[s]) matches++;
    }
    if(matches !== stopArray.length) continue;
    return edge;
  }

  return null;
};

module.exports = NetworkGraph;

/**
 * Vertex
 */

function Vertex(stop, x, y) {
  this.stop = stop;
  this.x = x;
  this.y = y;
  this.edges = [];
}

/**
 * Edge
 */

function Edge(stopArray, fromVertex, toVertex) {
  this.stopArray = stopArray;
  this.fromVertex = fromVertex;
  this.toVertex = toVertex;
}

Edge.prototype.pointAlongEdge = function(t) {
  // this.fromVertex.x + t*(this.toVertex.x - this.fromVertex.x);
  var x = this.fromVertex.x + t*(this.toVertex.x - this.fromVertex.x);
  var y = this.fromVertex.y + t*(this.toVertex.y - this.fromVertex.y);
  return { x: x, y: y };
};

Edge.prototype.heading = function() {
  var dx = this.fromVertex.x - this.toVertex.x;
  var dy = this.fromVertex.y - this.toVertex.y;
  var l = Math.sqrt(dx*dx + dy*dy);
  return { x: dx/l, y : dy/l };
};