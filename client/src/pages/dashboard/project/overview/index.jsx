import React, {useEffect, useState, useCallback} from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LeafNode from '@/components/LeafNode';
import WoodLogNode from "@/components/WoodLogNode";

const nodeTypes = {
  leaf: LeafNode,
  wood: WoodLogNode,
};

const woodLeafData = {
  "46": [54, 57, 64, 67, 69, 71, 73, 74],
  "47": [60, 62, 66, 68, 75],
  "48": [56, 70],
  "49": [76, 77]
};

const generateElements = (data) => {
  const nodes = [];
  const edges = [];

  let xPos = 100; // Initial x position for the first wood node
  const woodYPos = 300; // Fixed y position for wood nodes
  const woodSpacing = 300; // Increase the horizontal distance between wood nodes
  const leafOffsetY = 100; // Vertical distance between wood nodes and leaves

  // Generate wood nodes
  Object.keys(data).forEach((woodId, index) => {
	const woodNodeId = `wood-${woodId}`;
	nodes.push({
	  id: woodNodeId,
	  type: 'wood',
	  position: {x: xPos, y: woodYPos},
	  data: {},
	});


	if (index > 0) {
	  const previousWoodNodeId = `wood-${Object.keys(data)[index - 1]}`;
	  edges.push({
		id: `${previousWoodNodeId}-${woodNodeId}`,
		source: previousWoodNodeId,
		target: woodNodeId,
		sourceHandle: 'r',
		targetHandle: 'l',
	  });
	}

	xPos += woodSpacing;


	const leaves = data[woodId];
	const half = Math.ceil(leaves.length / 2);

	leaves.forEach((leafId, index) => {
	  const leafNodeId = `leaf-${leafId}`;
	  const isTop = index < half; // Determine if the leaf should go to the top or bottom

	  nodes.push({
		id: leafNodeId,
		type: 'leaf',
		position: {x: xPos, y: woodYPos + (isTop ? -leafOffsetY : leafOffsetY) * (index + 1)}, // Position leaves
		data: {rotate: false}, // You can modify this as needed
	  });

	  edges.push({
		id: `${woodNodeId}-${leafNodeId}`,
		source: woodNodeId,
		target: leafNodeId,
		sourceHandle: isTop ? 't' : 'b',
		targetHandle: 'b',
	  });
	});
  });

  return {nodes, edges};
};

const OverviewPage = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
	const {nodes: generatedNodes, edges: generatedEdges} = generateElements(woodLeafData);
	setNodes(generatedNodes);
	setEdges(generatedEdges);
  }, []);

  const onNodesChange = useCallback(
	 (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),

	[]
  );

  const onEdgesChange = useCallback(
	(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
	[]
  );
//onNodesChange kaldırdım for nondragablity
  return (
	<div style={{height: 500}}>
	  <ReactFlow
		nodes={nodes}
		edges={edges}
		nodeTypes={nodeTypes}
		onNodesChange={onNodesChange}
		onEdgesChange={onEdgesChange}
		fitView
	  >
		<MiniMap/>
		<Controls/>
		<Background/>
	  </ReactFlow>
	</div>
  );
};

export default OverviewPage;
