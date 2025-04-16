import React, { useState } from 'react';
import { Card, Form, Button, Table } from 'react-bootstrap';
import styles from '../styles/NonRestoringDivision.module.css';

const NonRestoringDivision = () => {
  const [dividend, setDividend] = useState('');
  const [divisor, setDivisor] = useState('');
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [remainder, setRemainder] = useState(null);
  const [binaryQuotient, setBinaryQuotient] = useState('');
  const [binaryRemainder, setBinaryRemainder] = useState('');

  const performNonRestoringDivision = (dividend, divisor) => {
    let Q = parseInt(dividend);
    let M = parseInt(divisor);
    
    if (M === 0) throw new Error("Division by zero");

    const isNegativeResult = (Q < 0) ^ (M < 0);
    const isDividendNegative = Q < 0;
    Q = Math.abs(Q);
    M = Math.abs(M);

    let A = 0;
    const N = Math.max(Q.toString(2).length, M.toString(2).length);
    let QBinary = Q.toString(2).padStart(N, '0');
    let detailedSteps = [];

    for (let i = 0; i < N; i++) {
      const initialA = A;
      const initialQ = QBinary;
      let operation = '';

      // Left shift A and Q
      const msbQ = QBinary.charAt(0);
      A = (A << 1) | parseInt(msbQ);
      QBinary = QBinary.slice(1) + '0';

      // Perform operation based on A's sign
      if (A >= 0) {
        operation = `A ≥ 0, Subtracted M (${M})`;
        A = A - M;
      } else {
        operation = `A < 0, Added M (${M})`;
        A = A + M;
      }

      // Set Q's LSB based on A's sign
      const newBit = A >= 0 ? 1 : 0;
      QBinary = QBinary.slice(0, N-1) + newBit;

      detailedSteps.push({
        step: i + 1,
        initialA: initialA.toString(2).padStart(N, '0'),
        initialQ: initialQ,
        operation: operation,
        afterOpA: A.toString(2).padStart(N, '0'),
        afterShiftQ: QBinary,
        newBit: newBit
      });
    }

    // Final correction if A is negative
    if (A < 0) {
      detailedSteps.push({
        step: N + 1,
        initialA: '-',
        initialQ: '-',
        operation: `Final Correction: Added M (${M})`,
        afterOpA: (A + M).toString(2).padStart(N, '0'),
        afterShiftQ: '-',
        newBit: '-'
      });
      A = A + M;
    }

    // Calculate final results
    let quotient = parseInt(QBinary, 2);
    if (isNegativeResult) quotient = -quotient;
    if (isDividendNegative) A = -A;

    return { 
      quotient, 
      remainder: A, 
      steps: detailedSteps,
      binaryQuotient: QBinary,
      binaryRemainder: A.toString(2).padStart(N, '0')
    };
  };

  const handleCalculate = () => {
    try {
      if (!dividend || !divisor || isNaN(parseInt(divisor))) {
        alert('Please enter valid numbers');
        return;
      }
      if (parseInt(divisor) === 0) {
        alert('Divisor cannot be zero');
        return;
      }

      const results = performNonRestoringDivision(dividend, divisor);
      setResult(results.quotient);
      setRemainder(results.remainder);
      setSteps(results.steps);
      setBinaryQuotient(results.binaryQuotient);
      setBinaryRemainder(results.binaryRemainder);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Card.Header className={styles.header}>
          <h2>Non-Restoring Division Algorithm</h2>
        </Card.Header>
        <Card.Body>
          <Form className={styles.form}>
            <Form.Group className="mb-3">
              <Form.Label>Dividend</Form.Label>
              <Form.Control
                type="number"
                className={styles.input}
                value={dividend}
                onChange={(e) => setDividend(e.target.value)}
                placeholder="Enter dividend"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Divisor</Form.Label>
              <Form.Control
                type="number"
                className={styles.input}
                value={divisor}
                onChange={(e) => setDivisor(e.target.value)}
                placeholder="Enter divisor"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              className={styles.button}
              onClick={handleCalculate}
            >
              Calculate
            </Button>
          </Form>

          {result !== null && (
            <div className={styles.results}>
              <h4>Results</h4>
              <div className={styles.resultItem}>
                <span>Quotient (Decimal):</span> {result}
              </div>
              <div className={styles.resultItem}>
                <span>Quotient (Binary):</span> {binaryQuotient}
              </div>
              <div className={styles.resultItem}>
                <span>Remainder (Decimal):</span> {remainder}
              </div>
              <div className={styles.resultItem}>
                <span>Remainder (Binary):</span> {binaryRemainder}
              </div>

              <h5 className={styles.stepsHeader}>Step-by-Step Calculation</h5>
              <div className={styles.tableWrapper}>
                <Table striped bordered hover className={styles.table}>
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Initial A</th>
                      <th>Initial Q</th>
                      <th>Operation</th>
                      <th>A After Op</th>
                      <th>Q After Shift</th>
                      <th>New Bit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((step, index) => (
                      <tr key={index}>
                        <td>{step.step}</td>
                        <td>{step.initialA}</td>
                        <td>{step.initialQ}</td>
                        <td>{step.operation}</td>
                        <td>{step.afterOpA}</td>
                        <td>{step.afterShiftQ}</td>
                        <td>{step.newBit}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NonRestoringDivision;