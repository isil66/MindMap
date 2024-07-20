// src/App.js
import React from 'react';
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
import {useState, useCallback} from 'react';


const nodeTypes = {
  leaf: LeafNode,
};

const elements = [
  {
	id: '1',
	type: 'leaf', // this should match the type defined in nodeTypes
	position: {x: 510, y: 250},
	data: {label:"hello"},
  },
  {
	id: '2',
	type: 'leaf', // this should match the type defined in nodeTypes
	position: {x: 300, y: 250},
	data: {},
  },
  //todo add it dynamically
];

const initialEdges = [
  { id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },
];

const OverviewPage = () => {

  const [nodes, setNodes] = useState(elements);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
	(changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
	[],
  );
  const onEdgesChange = useCallback(
	(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
	[],
  );

  //fitView ortalıyo

  return (
	<div style={{height: 500}}>
	  <ReactFlow
		nodes={elements}
		nodeTypes={nodeTypes}
		onNodesChange={onNodesChange}
		edges={edges}
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
