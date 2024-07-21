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
import {useRouter} from 'next/router';
import {AwesomeButton} from "react-awesome-button";



const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const nodeTypes = {
  leaf: LeafNode,
  wood: WoodLogNode,
};


const generateElements = (data) => {
  const nodes = [];
  const edges = [];

  let woodXPos = 100; // init x for first wood
  const woodYPos = 300; // fixed for now
  const woodSpacing = 300;
  const leafOffsetY = 200;
  const leafSpacingX = 75;


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
		position: {x: woodXPos + leafXOffset, y: woodYPos + leafOffsetY + 100},
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
  const router = useRouter();
  const [overViewData, setOverViewData] = useState(null);
  const {prj_id} = router.query;

  const fetchOverview = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/overview/${prj_id}/`, {
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
		setOverViewData(responseJson);
		const {nodes: generatedNodes, edges: generatedEdges} = generateElements(responseJson);
		setNodes(generatedNodes);
		setEdges(generatedEdges);
	  }
	} catch (error) {
	  console.log("err yedük yakala", error);
	}
  };

  useEffect(() => {
	fetchOverview();
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
	  <AwesomeButton
		onPress={() => {
		  router.push(`/dashboard/project/${prj_id}`);
		}}
		type="secondary"
		style={{
		  position: "absolute",
		  top: "20%",
		  left: "3%",
		  buttonPrimaryColor: "#230a10",
		  height: "40px",
		  width: "100px",
		  fontSize: "16px",
		  borderRadius: "10px",
		  primaryColor: "#00000"
		}}
	  >
		⬅Project
	  </AwesomeButton>
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
