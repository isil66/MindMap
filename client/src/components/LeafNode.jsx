import React from 'react';
import style from '../styles/LeafNode.module.css';
import LeafSVG from '../../public/leaf-svgrepo-com.svg';
import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

const LeafNode = ({ data }) => {
  const onChange = useCallback((evt) => {
	console.log(evt.target.value);
  }, []);

  return (
	<div className={style.leafNode}>
	  <LeafSVG />
	  <>


		<Handle type="target" position={Position.Bottom} id="a" />
		<Handle type="source" position={Position.Bottom} id="b"/>
	  </>
	</div>
  );
};

export default LeafNode;

