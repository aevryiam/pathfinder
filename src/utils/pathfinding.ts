import { Graph, Node, Edge, PathFindingResult } from '../types/graph';

export function dijkstra(graph: Graph, startNodeId: string, endNodeId: string): PathFindingResult {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const visited: Set<string> = new Set();
  const unvisited: Set<string> = new Set();

  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current = '';
    let smallestDistance = Infinity;
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        current = nodeId;
      }
    });

    if (current === endNodeId) {
      break;
    }

    unvisited.delete(current);
    visited.add(current);

    // Update distances to neighbors
    graph.edges
      .filter(edge => edge.from === current || edge.to === current)
      .forEach(edge => {
        const neighbor = edge.from === current ? edge.to : edge.from;
        if (!visited.has(neighbor)) {
          const distance = distances[current] + edge.weight;
          if (distance < distances[neighbor]) {
            distances[neighbor] = distance;
            previous[neighbor] = current;
          }
        }
      });
  }

  // Reconstruct path
  const path: string[] = [];
  let current = endNodeId;
  while (current) {
    path.unshift(current);
    current = previous[current] || '';
  }

  return {
    path: path.length > 1 ? path : [],
    distance: distances[endNodeId],
    visitedNodes: Array.from(visited),
  };
}

export function aStar(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): PathFindingResult {
  const openSet: Set<string> = new Set([startNodeId]);
  const closedSet: Set<string> = new Set();
  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};
  const cameFrom: { [key: string]: string | null } = {};

  // Initialize scores
  graph.nodes.forEach(node => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    cameFrom[node.id] = null;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(graph, startNodeId, endNodeId);

  while (openSet.size > 0) {
    // Find node with lowest fScore
    let current = '';
    let lowestFScore = Infinity;
    openSet.forEach(nodeId => {
      if (fScore[nodeId] < lowestFScore) {
        lowestFScore = fScore[nodeId];
        current = nodeId;
      }
    });

    if (current === endNodeId) {
      break;
    }

    openSet.delete(current);
    closedSet.add(current);

    // Check neighbors
    graph.edges
      .filter(edge => edge.from === current || edge.to === current)
      .forEach(edge => {
        const neighbor = edge.from === current ? edge.to : edge.from;
        if (closedSet.has(neighbor)) return;

        const tentativeGScore = gScore[current] + edge.weight;

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        } else if (tentativeGScore >= gScore[neighbor]) {
          return;
        }

        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(graph, neighbor, endNodeId);
      });
  }

  // Reconstruct path
  const path: string[] = [];
  let current = endNodeId;
  while (current) {
    path.unshift(current);
    current = cameFrom[current] || '';
  }

  return {
    path: path.length > 1 ? path : [],
    distance: gScore[endNodeId],
    visitedNodes: Array.from(closedSet),
  };
}

function heuristic(graph: Graph, nodeId: string, endNodeId: string): number {
  const node = graph.nodes.find(n => n.id === nodeId);
  const endNode = graph.nodes.find(n => n.id === endNodeId);
  
  if (!node || !endNode) return Infinity;

  // Euclidean distance as heuristic
  const dx = node.x - endNode.x;
  const dy = node.y - endNode.y;
  return Math.sqrt(dx * dx + dy * dy);
} 