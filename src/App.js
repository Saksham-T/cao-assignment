import React, { useState, useEffect } from 'react';  // Add useState and useEffect here
import 'bootstrap/dist/css/bootstrap.min.css';
import AlgorithmSelector from './components/AlgorithmSelector';
import BoothAlgorithm from './components/BoothMultiplication';
import RestoringDivision from './components/RestoringDivision';
import NonRestoringDivision from './components/NonRestoringDivision';
import './index.css';

function App() {
  const [algorithm, setAlgorithm] = useState(null);

  // Initialize Vanta.net effect when the component mounts
  useEffect(() => {
    // Ensure Vanta only runs once after component mounts
    if (typeof window !== 'undefined') {
      window.VANTA.NET({
        el: "#vanta-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00
      });
    }
  }, []);

  const renderAlgorithm = () => {
    switch (algorithm) {
      case 'booth': return <BoothAlgorithm />;
      case 'restoring': return <RestoringDivision />;
      case 'nonrestoring': return <NonRestoringDivision />;
      default: return <AlgorithmSelector onSelect={setAlgorithm} />;
    }
  };

  return (
    <div id="vanta-background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div className="app-container">
        {renderAlgorithm()}
      </div>
    </div>
  );
}

export default App;
