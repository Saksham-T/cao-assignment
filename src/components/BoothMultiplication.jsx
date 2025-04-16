/* global BigInt */

import React, { useState } from 'react';

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

    let M = BigInt(multiplicand);  // Multiplicand
    let Q = BigInt(multiplier);    // Multiplier
    let A = 0n;                    // Accumulator
    let Q_1 = 0n;                  // Q-1

    const bitLength = (num) => {
      if (num === 0n) return 1;
      return num < 0n ? num.toString(2).length : num.toString(2).length + 1;
    };

    let n = Math.max(bitLength(M), bitLength(Q)); // Number of bits for M and Q
    let count = n;  // Number of steps
    const mask = (1n << BigInt(n)) - 1n;

    const toBinary = (num, bits) => {
      let bin = (num & mask).toString(2);
      return bin.padStart(bits, '0');
    };

    // Convert M and Q to two's complement if negative
    if (M < 0n) M = (1n << BigInt(n)) + M;  // Two's complement of negative M
    if (Q < 0n) Q = (1n << BigInt(n)) + Q;  // Two's complement of negative Q

    while (count > 0) {
      let Q0 = Q & 1n;  // Least significant bit of Q

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

      // Apply operations based on the value of Q0 and Q-1
      if (Q0 === 1n && Q_1 === 0n) {
        A = A - M;  // A = A - M
        step.operation = `A = A - M → ${multiplicand}`;
      } else if (Q0 === 0n && Q_1 === 1n) {
        A = A + M;  // A = A + M
        step.operation = `A = A + M → ${multiplicand}`;
      } else {
        step.operation = `No operation`;
      }

      step.afterOpA = toBinary(A, n);

      // Perform the shift: combine A, Q, and Q-1 and shift right
      let combined = ((A & mask) << (BigInt(n) + 1n)) | ((Q & mask) << 1n) | Q_1;
      let signBit = combined >> BigInt(n * 2);
      combined = (combined >> 1n) | (signBit << BigInt(n * 2));

      // Update Q-1
      Q_1 = Q & 1n;
      // Update Q and A after the shift
      Q = (combined >> 1n) & mask;
      A = (combined >> BigInt(n + 1)) & mask;

      // Ensure proper sign extension for A
      if (A >> BigInt(n - 1)) A = A - (1n << BigInt(n));

      // Check for overflow and sign extension for Q
      if (Q >> BigInt(n - 1)) Q = Q - (1n << BigInt(n));

      step.afterShiftA = toBinary(A, n);
      step.afterShiftQ = toBinary(Q, n);
      step.afterShiftQ1 = Q_1.toString();

      detailedSteps.push(step);
      count--;
    }

    // After all iterations, combine A and Q for the final result
    let result = (A << BigInt(n)) | (Q & mask);

    // Check if the result is negative (two's complement interpretation)
    let signedResult = result >> BigInt(n * 2 - 1) ? result - (1n << BigInt(n * 2)) : result;

    return { result: signedResult.toString(), steps: detailedSteps };
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
        Booth's Multiplication Algorithm
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="number"
          placeholder="Multiplicand"
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-black"
          value={multiplicand}
          onChange={(e) => setMultiplicand(e.target.value)}
        />
        <input
          type="number"
          placeholder="Multiplier"
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-black"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-black font-bold py-2 px-4 rounded"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      </div>

      {result && (
        <>
          <p className="mt-4 text-lg font-semibold">Result (Decimal): {result}</p>
          <p className="text-md mb-4">Result (Binary): {BigInt(result).toString(2)}</p>
        </>
      )}

      {steps.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="bg-gray-800 text-black">
                <th className="border px-2 py-1">Step</th>
                <th className="border px-2 py-1">Initial A</th>
                <th className="border px-2 py-1">Initial Q</th>
                <th className="border px-2 py-1">Q-1</th>
                <th className="border px-2 py-1">Operation</th>
                <th className="border px-2 py-1">A After Op</th>
                <th className="border px-2 py-1">A After Shift</th>
                <th className="border px-2 py-1">Q After Shift</th>
                <th className="border px-2 py-1">Q-1 After Shift</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-2 py-1">{s.step}</td>
                  <td className="border px-2 py-1">{s.initialA}</td>
                  <td className="border px-2 py-1">{s.initialQ}</td>
                  <td className="border px-2 py-1">{s.initialQ1}</td>
                  <td className="border px-2 py-1">{s.operation}</td>
                  <td className="border px-2 py-1">{s.afterOpA}</td>
                  <td className="border px-2 py-1">{s.afterShiftA}</td>
                  <td className="border px-2 py-1">{s.afterShiftQ}</td>
                  <td className="border px-2 py-1">{s.afterShiftQ1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BoothMultiplication;
