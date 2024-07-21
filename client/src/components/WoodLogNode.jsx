import React from 'react';
import WoodLogSVG from '../../public/wood-svgrepo-com.svg';
import { useCallback } from 'react';
import style from '../styles/WoodLogNode.module.css';
import { Handle, Position } from '@xyflow/react';

const LeafNode = ({ data }) => {
  const onChange = useCallback((evt) => {
	console.log(evt.target.value);
  }, []);

  return (
	<div className={style.woodLogNode}>
	  <WoodLogSVG style={{ transform: 'rotate(270deg) ' }}/>
	  <>
		<Handle type="target" position={Position.Left} id="l" className={`${style.handle} ${style.handleLeft}`} />
		<Handle type="source" position={Position.Right} id="r" className={`${style.handle} ${style.handleRight}`} />
		<Handle type="target" position={Position.Top} id="t" className={`${style.handle} ${style.handleTop}`} />
		<Handle type="target" position={Position.Bottom} id="b" className={`${style.handle} ${style.handleBottom}`} />
	  </>
	</div>
  );
};

export default LeafNode;
