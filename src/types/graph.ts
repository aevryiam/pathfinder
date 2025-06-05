export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  directed?: boolean; // Add support for directed graphs
}

export interface PathFindingResult {
  path: string[];
  distance: number;
  visitedNodes: string[];
} 