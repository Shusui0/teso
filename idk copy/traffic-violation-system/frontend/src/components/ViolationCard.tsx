import React from 'react';

interface Violation {
  violation_type: string;
  timestamp: string;
  confidence_score: number;
  image_url: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface ViolationCardProps {
  violation: Violation;
}

const ViolationCard: React.FC<ViolationCardProps> = ({ violation }) => {
  return (
    <div className="violation-card">
      <h3>Violation Type: {violation.violation_type}</h3>
      <p>Time: {new Date(violation.timestamp).toLocaleString()}</p>
      <p>Confidence: {(violation.confidence_score * 100).toFixed(2)}%</p>
      <img src={violation.image_url} alt="Violation evidence" />
    </div>
  );
};

export default ViolationCard;