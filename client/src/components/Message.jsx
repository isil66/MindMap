import React from 'react';
import clsx from 'clsx';
import styles from '../styles/message.module.css';
export default function Message({type, text}) {
    console.log(type, "hey");
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
