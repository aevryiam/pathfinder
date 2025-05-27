'use client';

import { useState } from 'react';
import GraphVisualization from '../components/GraphVisualization';
import { dijkstra, aStar } from '../utils/pathfinding';
import { Node, Edge, PathFindingResult } from '../types/graph';

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [result, setResult] = useState<PathFindingResult | null>(null);
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'astar'>('dijkstra');
  const [selectingStart, setSelectingStart] = useState<boolean>(true);

  const handleNodeClick = (nodeId: string) => {
    if (selectingStart) {
      setStartNode(nodeId);
    } else {
      setEndNode(nodeId);
    }
  };

  const runAlgorithm = () => {
    if (!startNode || !endNode) {
      alert('Please select both start and end nodes');
      return;
    }
    const graph = { nodes, edges };
    const pathFindingResult = algorithm === 'dijkstra'
      ? dijkstra(graph, startNode, endNode)
      : aStar(graph, startNode, endNode);
    setResult(pathFindingResult);
  };

  const reset = () => {
    setStartNode(null);
    setEndNode(null);
    setResult(null);
  };

  const clearSelection = () => {
    setStartNode(null);
    setEndNode(null);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pathfinding Visualizer</h1>
        
        <div className="mb-8 space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setAlgorithm('dijkstra')}
              className={`px-4 py-2 rounded ${
                algorithm === 'dijkstra'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Dijkstra's Algorithm
            </button>
            <button
              onClick={() => setAlgorithm('astar')}
              className={`px-4 py-2 rounded ${
                algorithm === 'astar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              A* Algorithm
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={runAlgorithm}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Run Algorithm
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Clear Start/End
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setSelectingStart(true)}
              className={`px-4 py-2 rounded ${
                selectingStart
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Select Start Node
            </button>
            <button
              onClick={() => setSelectingStart(false)}
              className={`px-4 py-2 rounded ${
                !selectingStart
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Select End Node
            </button>
          </div>

          <div className="text-sm text-gray-800">
            <p className="font-semibold">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Click anywhere on the canvas to add nodes.</li>
              <li>
                <span className="font-semibold">How to Add Edges:</span>
                <ol className="list-decimal list-inside ml-4">
                  <li>Click a node to select it (it will be highlighted).</li>
                  <li>Click the <span className="font-semibold">Add Edge</span> button.</li>
                  <li>Click another node to connect to (you'll be prompted for the edge weight).</li>
                  <li>The order does not matter; connecting Node 0 to Node 1 is the same as Node 1 to Node 0.</li>
                </ol>
              </li>
              <li>Use the toggle buttons to select and change start/end nodes.</li>
              <li>Choose an algorithm and click <span className="font-semibold">Run Algorithm</span> to find the path.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GraphVisualization
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              onNodeClick={handleNodeClick}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Status</h2>
            <div className="space-y-2 text-gray-900">
              <p>
                Start Node:{' '}
                <span className="font-medium">
                  {startNode ? `Node ${startNode.split('-')[1]}` : 'Not selected'}
                </span>
              </p>
              <p>
                End Node:{' '}
                <span className="font-medium">
                  {endNode ? `Node ${endNode.split('-')[1]}` : 'Not selected'}
                </span>
              </p>
              {result && (
                <>
                  <p>
                    Path Length:{' '}
                    <span className="font-medium">{result.distance}</span>
                  </p>
                  <p>
                    Path:{' '}
                    <span className="font-medium">
                      {result.path.map(id => `Node ${id.split('-')[1]}`).join(' → ')}
                    </span>
                  </p>
                  <p>
                    Nodes Visited:{' '}
                    <span className="font-medium">{result.visitedNodes.length}</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
