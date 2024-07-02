import React from 'react';
import clsx from 'clsx';
import styles from '../styles/Message.css'; // Adjust the path as per your file structure
export default function Message({type, text}) {
    return (
        <div className={clsx(styles.message, {
            [styles.textSuccess]: type === 'success',
            [styles.textDanger]: type === 'error',
            [styles.textInfo]: type === 'info',
        })}>
            {text}
        </div>
    );
};
