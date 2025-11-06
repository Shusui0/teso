CREATE TABLE
IF NOT EXISTS reports
(
  id TEXT PRIMARY KEY,
  time TIMESTAMP
WITH TIME ZONE,
  violations JSONB,
  evidence_path TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  address TEXT
);