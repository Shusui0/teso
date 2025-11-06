export interface ViolationReport {
  violation_type: string;
  timestamp: string;
  confidence_score: number;
  image_url: string;
  location: {
    lat: number;
    lng: number;
  };
}