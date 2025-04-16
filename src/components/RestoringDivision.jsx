import React, { useState } from 'react';
import styles from '../styles/RestoringDivision.module.css';
import { Card } from 'react-bootstrap';

function RestoringDivision() {
  const [dividend, setDividend] = useState('');
  const [divisor, setDivisor] = useState('');
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [remainder, setRemainder] = useState(null);

  const restoringDivision = (dividend, divisor) => {
    let Q = Math.abs(parseInt(dividend));
    let M = Math.abs(parseInt(divisor));
    let A = 0;
    let Q1 = 0;
    const N = Q.toString(2).length;
    let detailedSteps = [];

    for (let i = 0; i < N; i++) {
      let initialA = A;
      let initialQ = Q;
      let initialQ1 = Q1;

      A = (A << 1) | ((Q >> (N - 1)) & 1);
      Q = (Q << 1) & ((1 << N) - 1); // Logical shift
      A = A - M;

      let operation = `A - M = ${A}`;
      if (A < 0) {
        Q = Q & ~1;  // Set Q0 to 0
        A = A + M;
        operation = `A was negative, restored A = ${A}`;
      } else {
        Q = Q | 1;  // Set Q0 to 1
      }

      detailedSteps.push({
        step: i + 1,
        initialA: initialA,
        initialQ: initialQ.toString(2).padStart(N, '0'),
        initialQ1: initialQ1,
        operation: operation,
        afterOpA: A,
        afterShiftA: A,
        afterShiftQ: Q.toString(2).padStart(N, '0'),
        afterShiftQ1: Q1
      });
    }

    const quotient = ((parseInt(dividend) < 0) ^ (parseInt(divisor) < 0)) ? -Q : Q;
    const remainder = (parseInt(dividend) < 0) ? -A : A;
    return { result: quotient, remainder, steps: detailedSteps };
  };

  const handleCalculate = () => {
    if (!dividend || !divisor || parseInt(divisor) === 0) {
      alert('Please enter valid numbers (divisor cannot be zero).');
      return;
    }
    const { result, remainder, steps } = restoringDivision(dividend, divisor);
    setResult(result);
    setRemainder(remainder);
    setSteps(steps);
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <h2>Restoring Division</h2>
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
    </div>
  );
}

export default RestoringDivision;
