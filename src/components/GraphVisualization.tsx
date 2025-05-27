import React, { useRef, useEffect, useState } from 'react';
import { Node, Edge } from '../types/graph';

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nextNodeId: number;
  setNextNodeId: React.Dispatch<React.SetStateAction<number>>;
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

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = '#666';
      ctx.stroke();

      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(edge.weight.toString(), midX, midY);
    });

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = selectedNode === node.id ? '#4CAF50' : '#2196F3';
      ctx.fill();
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode]);

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
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        className="border border-gray-300 rounded-lg"
      />
      <div className="absolute top-4 left-4 space-x-2">
        <button
          onClick={() => {
            setIsDrawingEdge(true);
            setStartNode(selectedNode);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
};

export default GraphVisualization; 