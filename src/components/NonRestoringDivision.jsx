import React, { useState } from 'react';
import styles from '../styles/NonRestoringDivision.module.css';
import { Card, Button } from 'react-bootstrap';

function NonRestoringDivision() {
  const [dividend, setDividend] = useState('');
  const [divisor, setDivisor] = useState('');
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [remainder, setRemainder] = useState(null);

  const nonRestoringDivision = (dividend, divisor) => {
    let steps = [];

    let Q = Math.abs(parseInt(dividend));
    let M = Math.abs(parseInt(divisor));
    let A = 0;
    const N = Q.toString(2).length;

    for (let i = 0; i < N; i++) {
      A = (A << 1) | ((Q >> (N - 1)) & 1);
      Q = (Q << 1) & ((1 << (N + 1)) - 1);

      if (A >= 0) {
        A = A - M;
        steps.push(`Step ${i + 1}: A >= 0, Subtracted M -> A=${A}`);
      } else {
        A = A + M;
        steps.push(`Step ${i + 1}: A < 0, Added M -> A=${A}`);
      }

      if (A >= 0) {
        Q = Q | 1;
        steps.push(`Step ${i + 1}: A >= 0, Set Q0=1 -> Q=${Q.toString(2).padStart(N + 1, '0')}`);
      } else {
        Q = Q & ~1;
        steps.push(`Step ${i + 1}: A < 0, Set Q0=0 -> Q=${Q.toString(2).padStart(N + 1, '0')}`);
      }
    }

    if (A < 0) {
      A = A + M;
      steps.push(`Final Correction: A was negative, Added M -> A=${A}`);
    }

    const quotient = ((parseInt(dividend) < 0) ^ (parseInt(divisor) < 0)) ? -Q : Q;
    const remainder = (parseInt(dividend) < 0) ? -A : A;

    return { result: quotient, remainder, steps };
  };

  const handleCalculate = () => {
    if (!dividend || !divisor || parseInt(divisor) === 0) {
      alert('Please enter valid numbers (divisor cannot be zero).');
      return;
    }
    const { result, remainder, steps } = nonRestoringDivision(dividend, divisor);
    setResult(result);
    setRemainder(remainder);
    setSteps(steps);
  };

  return (
    <Card className={styles.card}>
      <h2>Non-Restoring Division</h2>
      <input
        type="number"
        placeholder="Dividend"
        value={dividend}
        onChange={(e) => setDividend(e.target.value)}
      />
      <input
        type="number"
        placeholder="Divisor"
        value={divisor}
        onChange={(e) => setDivisor(e.target.value)}
      />
      <button onClick={handleCalculate}>Calculate</button>

      {result !== null && (
        <>
          <p>Quotient (Decimal): {result}</p>
          <p>Quotient (Binary): {result.toString(2)}</p>
          <p>Remainder: {remainder}</p>

          <div className={styles["table-wrapper"]}>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{step}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

export default NonRestoringDivision;
