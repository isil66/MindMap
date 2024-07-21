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

  let woodXPos = 100; // init x for first wood
  const woodYPos = 300; // fixed for now
  const woodSpacing = 300;
  const leafOffsetY = 200; // Vertical distance between wood nodes and leaves
  const leafSpacingX = 75; // Horizontal spacing between leaves

  // Generate wood nodes
  Object.keys(data).forEach((woodId, woodIndex) => {
	//handle wood nodes
	const woodNodeId = `wood-${woodId}`;
	nodes.push({
	  id: woodNodeId,
	  type: 'wood',
	  position: {x: woodXPos, y: woodYPos},
	  data: {},
	});

	if (woodIndex > 0) {
	  const previousWoodNodeId = `wood-${Object.keys(data)[woodIndex - 1]}`;
	  edges.push({
		id: `${previousWoodNodeId}-${woodNodeId}`,
		source: previousWoodNodeId,
		target: woodNodeId,
		sourceHandle: 'r',
		targetHandle: 'l',
	  });
	}


	//handle leaf nodes
	const leaves = data[woodId];
	const half = Math.ceil(leaves.length / 2);
	const topLeaves = leaves.slice(0, half);
	const bottomLeaves = leaves.slice(half);

	topLeaves.forEach((leafId, leafIndex) => {
	  const leafNodeId = `leaf-${leafId}`;
	  const leafXOffset = leafSpacingX * leafIndex;
	  nodes.push({
		id: leafNodeId,
		type: 'leaf',
		position: {x: woodXPos + leafXOffset, y: woodYPos - leafOffsetY},
		data: {rotate: false},
	  });

	  edges.push({
		id: `${woodNodeId}-${leafNodeId}`,
		source: woodNodeId,
		target: leafNodeId,
		sourceHandle: 't',
		targetHandle: 'a',
		type: 'bezier',
	  });
	});

	bottomLeaves.forEach((leafId, leafIndex) => {
	  const leafNodeId = `leaf-${leafId}`;
	  const leafXOffset = leafSpacingX * leafIndex;
	  nodes.push({
		id: leafNodeId,
		type: 'leaf',
		position: {x: woodXPos + leafXOffset, y: woodYPos + leafOffsetY +100},
		data: {rotate: true},
	  });

	  edges.push({
		id: `${woodNodeId}-${leafNodeId}`,
		source: woodNodeId,
		target: leafNodeId,
		sourceHandle: 'b',
		targetHandle: 'a',
		type: 'bezier',
	  });
	});
	woodXPos += woodSpacing;
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

		onEdgesChange={onEdgesChange}
		fitView
	  >

		<Controls/>
		<Background/>
	  </ReactFlow>
	</div>
  );
};

export default OverviewPage;
