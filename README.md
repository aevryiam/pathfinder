# Pathfinding Visualizer

An interactive web application that allows users to visualize and experiment with pathfinding algorithms. The application supports both Dijkstra's algorithm and A* algorithm for finding the shortest path between nodes in a graph.

## Features

- Interactive graph creation with nodes and weighted edges
- Support for Dijkstra's algorithm and A* algorithm
- Real-time visualization of the pathfinding process
- Ability to set custom edge weights
- Visual feedback for the shortest path and visited nodes

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pathfinder.git
cd pathfinder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1. **Creating Nodes**
   - Click anywhere on the canvas to create a new node
   - Nodes will be automatically labeled with sequential numbers

2. **Creating Edges**
   - Select a node by clicking on it
   - Click the "Add Edge" button
   - Click on another node to create an edge
   - Enter the weight for the edge when prompted

3. **Setting Start and End Points**
   - Click on a node to set it as the start point
   - Click on another node to set it as the end point

4. **Running Algorithms**
   - Choose between Dijkstra's algorithm and A* algorithm using the toggle buttons
   - Click "Run Algorithm" to find the shortest path
   - The path will be highlighted, and statistics will be shown in the status panel

5. **Resetting**
   - Click the "Reset" button to clear the start/end points and results
   - You can continue to modify the graph and run the algorithm again

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Canvas API for graph visualization

## License

This project is licensed under the MIT License - see the LICENSE file for details.
