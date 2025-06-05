import React, { useRef, useEffect, useState } from 'react';
import { Node, Edge } from '../types/graph';

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nextNodeId: number;
  setNextNodeId: React.Dispatch<React.SetStateAction<number>>;
  isDirected: boolean;
  path?: string[];
  visitedNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  nextNodeId,
  setNextNodeId,
  isDirected,
  path = [],
  visitedNodes = [],
  onNodeClick,
  onEdgeClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDrawingEdge, setIsDrawingEdge] = useState(false);
  const [startNode, setStartNode] = useState<string | null>(null);

  const addNode = (x: number, y: number) => {
    const newNode: Node = {
      id: `node-${nextNodeId}`,
      x,
      y,
      label: `Node ${nextNodeId}`,
    };
    setNodes([...nodes, newNode]);
    setNextNodeId(nextNodeId + 1);
  };

  const addEdge = (from: string, to: string, weight: number) => {
    const newEdge: Edge = {
      id: `edge-${edges.length}`,
      from,
      to,
      weight,
    };
    setEdges([...edges, newEdge]);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headlen = 15; // length of head in pixels
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Calculate arrow position to stop at edge of node circle
    const nodeRadius = 20;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const adjustedToX = toX - (nodeRadius * dx) / distance;
    const adjustedToY = toY - (nodeRadius * dy) / distance;
    
    // Draw line
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(adjustedToX, adjustedToY);
    
    // Draw arrowhead
    ctx.moveTo(adjustedToX, adjustedToY);
    ctx.lineTo(
      adjustedToX - headlen * Math.cos(angle - Math.PI / 6),
      adjustedToY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(adjustedToX, adjustedToY);
    ctx.lineTo(
      adjustedToX - headlen * Math.cos(angle + Math.PI / 6),
      adjustedToY - headlen * Math.sin(angle + Math.PI / 6)
    );
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return;

      // Check if this edge is part of the path
      const isPathEdge = path.length > 1 && 
        path.some((nodeId, index) => 
          index < path.length - 1 && 
          ((edge.from === nodeId && edge.to === path[index + 1]) ||
           (!isDirected && edge.to === nodeId && edge.from === path[index + 1]))
        );

      ctx.beginPath();
      ctx.strokeStyle = isPathEdge ? '#ff4444' : '#666';
      ctx.lineWidth = isPathEdge ? 3 : 2;

      if (isDirected) {
        drawArrow(ctx, fromNode.x, fromNode.y, toNode.x, toNode.y);
      } else {
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
      }
      ctx.stroke();

      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 14px Arial';
      ctx.strokeText(edge.weight.toString(), midX, midY);
      ctx.fillText(edge.weight.toString(), midX, midY);
    });    // Draw nodes
    nodes.forEach((node) => {
      const isVisited = visitedNodes.includes(node.id);
      const isInPath = path.includes(node.id);
      const isSelected = selectedNode === node.id;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      
      // Node colors based on state
      if (isInPath) {
        ctx.fillStyle = '#ff6b6b'; // Red for path nodes
      } else if (isVisited) {
        ctx.fillStyle = '#ffd93d'; // Yellow for visited nodes
      } else if (isSelected) {
        ctx.fillStyle = '#4CAF50'; // Green for selected
      } else {
        ctx.fillStyle = '#74b9ff'; // Blue for normal nodes
      }
      
      ctx.fill();
      ctx.strokeStyle = '#2d3436';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#2d3436';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(node.label, node.x, node.y);
    });
  };
  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode, path, visitedNodes]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 20;
    });

    if (clickedNode) {
      if (isDrawingEdge) {
        if (startNode && startNode !== clickedNode.id) {
          const weight = prompt('Enter edge weight:');
          if (weight) {
            addEdge(startNode, clickedNode.id, parseInt(weight));
          }
          setIsDrawingEdge(false);
          setStartNode(null);
        }
      } else {
        setSelectedNode(clickedNode.id);
        onNodeClick?.(clickedNode.id);
      }
    } else {
      addNode(x, y);
    }
  };
  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        className="border-0 cursor-pointer bg-gray-50"
      />
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setIsDrawingEdge(true);
            setStartNode(selectedNode);
          }}
          disabled={!selectedNode}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          Add Edge
        </button>
        <button
          onClick={() => {
            if (selectedNode) {
              setNodes(nodes.filter((n) => n.id !== selectedNode));
              setEdges(edges.filter((e) => e.from !== selectedNode && e.to !== selectedNode));
              setSelectedNode(null);
            }
          }}
          disabled={!selectedNode}
          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          Delete Node
        </button>
      </div>
      
      {/* Canvas instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
        Click anywhere to add nodes • Select a node, then click "Add Edge" to connect
      </div>
    </div>
  );
};

export default GraphVisualization; 