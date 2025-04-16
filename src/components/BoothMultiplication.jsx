/* global BigInt */

import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import styles from '../styles/BoothAlgorithm.module.css';

const BoothMultiplication = () => {
  const [multiplicand, setMultiplicand] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleCalculate = () => {
    if (multiplicand === '' || multiplier === '') return;
    const { result, steps } = boothsMultiplication(multiplicand, multiplier);
    setResult(result);
    setSteps(steps);
  };

  function boothsMultiplication(multiplicand, multiplier) {
    let detailedSteps = [];

    let M = BigInt(multiplicand);
    let Q = BigInt(multiplier);
    let A = 0n;
    let Q_1 = 0n;

    const bitLength = (num) => {
      if (num === 0n) return 1;
      return num < 0n ? num.toString(2).length : num.toString(2).length + 1;
    };

    let n = Math.max(bitLength(M), bitLength(Q));
    let count = n;
    const mask = (1n << BigInt(n)) - 1n;

    const toBinary = (num, bits) => {
      let bin = (num & mask).toString(2);
      return bin.padStart(bits, '0');
    };

    if (M < 0n) M = (1n << BigInt(n)) + M;
    if (Q < 0n) Q = (1n << BigInt(n)) + Q;

    while (count > 0) {
      let Q0 = Q & 1n;
      const step = {
        step: `${n - count + 1}`,
        initialA: toBinary(A, n),
        initialQ: toBinary(Q, n),
        initialQ1: Q_1.toString(),
        operation: '',
        afterOpA: '',
        afterShiftA: '',
        afterShiftQ: '',
        afterShiftQ1: '',
      };

      if (Q0 === 1n && Q_1 === 0n) {
        A = A - M;
        step.operation = `A = A - M → ${multiplicand}`;
      } else if (Q0 === 0n && Q_1 === 1n) {
        A = A + M;
        step.operation = `A = A + M → ${multiplicand}`;
      } else {
        step.operation = `No operation`;
      }

      step.afterOpA = toBinary(A, n);

      let combined = ((A & mask) << (BigInt(n) + 1n)) | ((Q & mask) << 1n) | Q_1;
      let signBit = combined >> BigInt(n * 2);
      combined = (combined >> 1n) | (signBit << BigInt(n * 2));

      Q_1 = Q & 1n;
      Q = (combined >> 1n) & mask;
      A = (combined >> BigInt(n + 1)) & mask;

      if (A >> BigInt(n - 1)) A = A - (1n << BigInt(n));
      if (Q >> BigInt(n - 1)) Q = Q - (1n << BigInt(n));

      step.afterShiftA = toBinary(A, n);
      step.afterShiftQ = toBinary(Q, n);
      step.afterShiftQ1 = Q_1.toString();

      detailedSteps.push(step);
      count--;
    }

    let result = (A << BigInt(n)) | (Q & mask);
    let signedResult = result >> BigInt(n * 2 - 1) ? result - (1n << BigInt(n * 2)) : result;

    return { result: signedResult.toString(), steps: detailedSteps };
  }

  return (
    <Card className={styles.card}>
      <h2>Booth's Multiplication</h2>
      <input
        type="number"
        placeholder="Multiplicand"
        value={multiplicand}
        onChange={(e) => setMultiplicand(e.target.value)}
      />
      <input
        type="number"
        placeholder="Multiplier"
        value={multiplier}
        onChange={(e) => setMultiplier(e.target.value)}
      />
      <Button onClick={handleCalculate}>Calculate</Button>

      {result !== null && (
        <>
          <p>Result (Decimal): {result}</p>
          <p>Result (Binary): {BigInt(result).toString(2)}</p>

          <div className={styles["table-wrapper"]}>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Initial A</th>
                  <th>Initial Q</th>
                  <th>Q-1</th>
                  <th>Operation</th>
                  <th>A After Op</th>
                  <th>A After Shift</th>
                  <th>Q After Shift</th>
                  <th>Q-1 After Shift</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s, index) => (
                  <tr key={index}>
                    <td>{s.step}</td>
                    <td>{s.initialA}</td>
                    <td>{s.initialQ}</td>
                    <td>{s.initialQ1}</td>
                    <td>{s.operation}</td>
                    <td>{s.afterOpA}</td>
                    <td>{s.afterShiftA}</td>
                    <td>{s.afterShiftQ}</td>
                    <td>{s.afterShiftQ1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
};

export default BoothMultiplication;
