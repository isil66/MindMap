import React, {useEffect} from 'react';
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
import {useState, useCallback} from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const nodeTypes = {
  leaf: LeafNode,
  wood: WoodLogNode
};

const elements = [
  {
	id: '1',
	type: 'leaf', // this should match the type defined in nodeTypes
	position: {x: 510, y: 250},
	data: {label: "hello", rotate: false},
  },
  {
	id: '2',
	type: 'leaf',
	position: {x: 300, y: 250},
	data: {rotate: true}, //prop burdan atılıyo
  },
  {
	id: '3',
	type: 'wood',
	position: {x: 350, y: 400},
	data: {},
  },
];

const initialEdges = [
  {id: '1-3', source: '1', target: '3', targetHandle: 't', label: '', type: 'step'},
  {id: '2-3', source: '2', target: '3', targetHandle: 't', label: '', type: 'step'},
];

const OverviewPage = () => {

  const fetchOverview = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/overview/25/`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Token ${storedToken}`,
		},

	  });
	  if (!response.ok) {
		console.log("failed overview")
	  } else {
		console.log("succesfully overview");
		const responseJson = await response.json();
		console.log(responseJson);
	  }
	} catch (error) {
	  console.log("err yedük yakala", error);
	}
  };

  useEffect(() => {
	fetchOverview();
  }, []);

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
