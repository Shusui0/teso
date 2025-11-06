import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Violation {
  location: {
    lat: number;
    lng: number;
  };
  violation_type: string;
  timestamp: string;
}

interface MapProps {
  violations: Violation[];
}

const Map: React.FC<MapProps> = ({ violations }) => {
  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {violations.map((violation, index) => (
        <Marker key={index} position={[violation.location.lat, violation.location.lng]}>
          <Popup>
            {violation.violation_type}<br />
            {new Date(violation.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;