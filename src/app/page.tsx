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
  const [result, setResult] = useState<PathFindingResult | null>(null);  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'astar'>('dijkstra');
  const [selectingStart, setSelectingStart] = useState<boolean>(true);
  const [nextNodeId, setNextNodeId] = useState<number>(0);
  const [isDirected, setIsDirected] = useState<boolean>(false);

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
    const graph = { nodes, edges, directed: isDirected };
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pathfinding Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Visualize Dijkstra's and A* algorithms on directed and undirected graphs
          </p>
        </div>        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setAlgorithm('dijkstra')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  algorithm === 'dijkstra'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dijkstra's Algorithm
              </button>
              <button
                onClick={() => setAlgorithm('astar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  algorithm === 'astar'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                A* Algorithm
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDirected}
                  onChange={(e) => setIsDirected(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Directed Graph</span>
              </label>
            </div>
          </div>          <div className="flex flex-wrap gap-2">
            <button
              onClick={runAlgorithm}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-md"
            >
              Run Algorithm
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md"
            >
              Reset
            </button>
            <button
              onClick={clearSelection}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors shadow-md"
            >
              Clear Selection
            </button>
          </div>          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectingStart(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectingStart
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Select Start Node
            </button>
            <button
              onClick={() => setSelectingStart(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !selectingStart
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Select End Node
            </button>
          </div>          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
              <li>Click anywhere on the canvas to add nodes.</li>
              <li>
                <span className="font-semibold">How to Add Edges:</span>
                <ol className="list-decimal list-inside ml-4 mt-1">
                  <li>Click a node to select it (it will be highlighted).</li>
                  <li>Click the <span className="font-semibold">Add Edge</span> button.</li>
                  <li>Click another node to connect to (you'll be prompted for the edge weight).</li>
                  <li>{isDirected ? 'For directed graphs, edges go from the first selected node to the second.' : 'For undirected graphs, edges work in both directions.'}</li>
                </ol>
              </li>
              <li>Use the toggle buttons to select start/end nodes for pathfinding.</li>
              <li>Toggle between directed and undirected graph modes.</li>
              <li>Choose an algorithm and click <span className="font-semibold">Run Algorithm</span> to find the shortest path.</li>            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">          <div className="xl:col-span-3">
            <GraphVisualization
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              nextNodeId={nextNodeId}
              setNextNodeId={setNextNodeId}
              isDirected={isDirected}
              path={result?.path}
              visitedNodes={result?.visitedNodes}
              onNodeClick={handleNodeClick}
            />
          </div>          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">Algorithm Status</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">Graph Type:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  isDirected ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isDirected ? 'Directed' : 'Undirected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Start Node:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  startNode ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-500'
                }`}>
                  {startNode ? `Node ${startNode.split('-')[1]}` : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">End Node:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  endNode ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-500'
                }`}>
                  {endNode ? `Node ${endNode.split('-')[1]}` : 'Not selected'}
                </span>
              </div>
              {result && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h3 className="font-semibold text-gray-900 mb-2">Results:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Distance:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                          {result.distance === Infinity ? '∞' : result.distance}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Path:</span>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                          {result.path.length > 0 ? 
                            result.path.map(id => `Node ${id.split('-')[1]}`).join(' → ') :
                            'No path found'
                          }
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Nodes Visited:</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                          {result.visitedNodes.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
              {/* Legend */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Node Legend:</h3>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-full border border-gray-300 shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Normal Node</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-500 shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Visited by Algorithm</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full border border-red-500 shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Final Path Node</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full border border-green-600 shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Selected Node</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Edge Legend:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-0.5 bg-gray-500"></div>
                    <span className="text-sm text-gray-700">Normal Edge</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-0.5 bg-red-500"></div>
                    <span className="text-sm text-gray-700">Path Edge</span>
                  </div>
                  {isDirected && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <div className="w-4 h-0.5 bg-gray-500"></div>
                        <div className="w-0 h-0 border-l-2 border-l-gray-500 border-t border-t-transparent border-b border-b-transparent ml-0.5"></div>
                      </div>
                      <span className="text-sm text-gray-700">Directed Edge</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
