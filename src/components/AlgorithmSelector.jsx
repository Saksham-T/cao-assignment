import React from 'react';
import styles from '../styles/AlgorithmSelector.module.css';

function AlgorithmSelector({ onSelect }) {
  return (
    <div className={styles.selectorContainer}>
      <h1>Select Algorithm</h1>
      <div className={styles.cardGrid}>
        <div className={styles.card} onClick={() => onSelect('booth')}>
          Booth's Multiplication
        </div>
        <div className={styles.card} onClick={() => onSelect('restoring')}>
          Restoring Division
        </div>
        <div className={styles.card} onClick={() => onSelect('nonrestoring')}>
          Non-Restoring Division
        </div>
      </div>
    </div>
  );
}

export default AlgorithmSelector;
