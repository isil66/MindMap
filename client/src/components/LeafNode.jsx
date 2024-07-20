import React from 'react';
import style from '../styles/LeafNode.module.css';
import LeafSVG from '../../public/leaf-svgrepo-com.svg';

const LeafNode = ({ data }) => {

  return (
	<div className={style.leafNode}>
	  <LeafSVG />
	</div>
  );
};

export default LeafNode;

