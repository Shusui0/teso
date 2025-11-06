import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ViolationCard from './components/ViolationCard';
import Map from './components/Map';
import { ViolationReport } from './types';

const App: React.FC = () => {
  const [violations, setViolations] = useState<ViolationReport[]>([]);

  const addViolation = (violation: ViolationReport) => {
    setViolations((prevViolations) => [...prevViolations, violation]);
  };

  return (
    <div className="App">
      <header>
        <h1>Smart Traffic Violation Detection System</h1>
      </header>
      
      <FileUpload onUpload={addViolation} />

      <div className="violations-list">
        {violations.map((violation, index) => (
          <ViolationCard key={index} violation={violation} />
        ))}
      </div>

      <Map violations={violations} />
    </div>
  );
}

export default App;