import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, MapPin, AlertTriangle, CheckCircle, XCircle, BarChart3, Map, Download, Trash2 } from 'lucide-react';

const TrafficViolationSystem = () => {
  const [activeTab, setActiveTab] = useState('detection');
  const [violations, setViolations] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Simulated AI detection function (in production, this would call a real ML model)
  const detectViolations = async (imageData) => {
    setAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulated detection results with randomization for demo
    const violationTypes = [
      { type: 'Helmetless Riding', confidence: 0.85 + Math.random() * 0.12, detected: Math.random() > 0.3 },
      { type: 'Wrong-side Driving', confidence: 0.78 + Math.random() * 0.15, detected: Math.random() > 0.5 },
      { type: 'Signal Jumping', confidence: 0.82 + Math.random() * 0.13, detected: Math.random() > 0.4 },
      { type: 'Triple Riding', confidence: 0.88 + Math.random() * 0.10, detected: Math.random() > 0.6 }
    ];

    const detectedViolations = violationTypes.filter(v => v.detected && v.confidence > 0.75);
    
    // Simulated location extraction (in production, this would use EXIF data or geolocation API)
    const locations = [
      { lat: 12.9075, lon: 77.4854, address: "Kengeri, Bangalore" },
      { lat: 12.8456, lon: 77.5103, address: "Global Village, Bangalore" },
      { lat: 12.9141, lon: 77.4789, address: "Kengeri Satellite Town, Bangalore" }
    ];
    
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const result = {
      timestamp: new Date().toISOString(),
      location: location,
      violations: detectedViolations,
      imageData: imageData,
      reportId: `VR-${Date.now()}`
    };
    
    setDetectionResult(result);
    setAnalyzing(false);
    
    return result;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setSelectedImage(imageData);
        const result = await detectViolations(imageData);
        
        if (result.violations.length > 0) {
          setViolations(prev => [result, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      alert('Camera access denied or not available');
    }
  };

  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      
      const result = await detectViolations(imageData);
      if (result.violations.length > 0) {
        setViolations(prev => [result, ...prev]);
      }
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const exportReport = (violation) => {
    const report = {
      reportId: violation.reportId,
      timestamp: new Date(violation.timestamp).toLocaleString(),
      location: violation.location.address,
      coordinates: `${violation.location.lat}, ${violation.location.lon}`,
      violations: violation.violations.map(v => ({
        type: v.type,
        confidence: `${(v.confidence * 100).toFixed(2)}%`
      }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `violation-report-${violation.reportId}.json`;
    a.click();
  };

  const clearViolations = () => {
    setViolations([]);
    setDetectionResult(null);
    setSelectedImage(null);
  };

  const getViolationStats = () => {
    const stats = {};
    violations.forEach(v => {
      v.violations.forEach(violation => {
        stats[violation.type] = (stats[violation.type] || 0) + 1;
      });
    });
    return stats;
  };

  const getLocationHotspots = () => {
    const hotspots = {};
    violations.forEach(v => {
      const loc = v.location.address;
      hotspots[loc] = (hotspots[loc] || 0) + v.violations.length;
    });
    return Object.entries(hotspots).sort((a, b) => b[1] - a[1]);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold">Smart Traffic Violation Detection</h1>
          </div>
          <p className="text-blue-200 text-lg">AI-Powered Road Safety Monitoring for Kengeri & Global Village</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-2 rounded-lg">
          <button
            onClick={() => setActiveTab('detection')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'detection' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Camera className="w-5 h-5" />
            Detection
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'reports' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Reports ({violations.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'analytics' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Map className="w-5 h-5" />
            Analytics
          </button>
        </div>

        {/* Detection Tab */}
        {activeTab === 'detection' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-400" />
                Upload Image
              </h2>
              
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={analyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Choose Image File
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">OR</span>
                  </div>
                </div>

                {!stream ? (
                  <button
                    onClick={startCamera}
                    disabled={analyzing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Start Live Camera
                  </button>
                ) : (
                  <div className="space-y-3">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-black"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={captureFrame}
                        disabled={analyzing}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-3 rounded-lg transition-all"
                      >
                        Capture & Analyze
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {selectedImage && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Selected Image</h3>
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="w-full rounded-lg border-2 border-slate-600"
                  />
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                Detection Results
              </h2>

              {analyzing && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-lg text-slate-300">Analyzing image...</p>
                </div>
              )}

              {!analyzing && detectionResult && (
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-red-400" />
                      <span className="font-semibold">Location</span>
                    </div>
                    <p className="text-slate-300">{detectionResult.location.address}</p>
                    <p className="text-sm text-slate-400">
                      {detectionResult.location.lat.toFixed(6)}, {detectionResult.location.lon.toFixed(6)}
                    </p>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-sm text-slate-400 mb-1">Report ID</p>
                    <p className="font-mono text-blue-400">{detectionResult.reportId}</p>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-sm text-slate-400 mb-1">Timestamp</p>
                    <p>{new Date(detectionResult.timestamp).toLocaleString()}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Detected Violations ({detectionResult.violations.length})
                    </h3>
                    {detectionResult.violations.length === 0 ? (
                      <div className="flex items-center gap-2 text-green-400 bg-green-900/20 p-4 rounded-lg border border-green-700">
                        <CheckCircle className="w-5 h-5" />
                        No violations detected
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detectionResult.violations.map((violation, idx) => (
                          <div key={idx} className="bg-red-900/20 border border-red-700 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-red-300">{violation.type}</span>
                              <span className="text-sm px-2 py-1 bg-red-800 rounded">
                                {(violation.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full transition-all"
                                style={{ width: `${violation.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {detectionResult.violations.length > 0 && (
                    <button
                      onClick={() => exportReport(detectionResult)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Export Report
                    </button>
                  )}
                </div>
              )}

              {!analyzing && !detectionResult && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Camera className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Upload an image or use camera to start detection</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Violation Reports
              </h2>
              {violations.length > 0 && (
                <button
                  onClick={clearViolations}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {violations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No violations detected yet</p>
                <p className="text-sm">Start detecting violations to see reports here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {violations.map((violation, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-6 rounded-lg border border-slate-600 hover:border-blue-500 transition-all">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <img 
                          src={violation.imageData} 
                          alt="Violation evidence" 
                          className="w-full rounded-lg border border-slate-700 mb-4"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => exportReport(violation)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Report ID</p>
                          <p className="font-mono text-blue-400">{violation.reportId}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Timestamp</p>
                          <p>{new Date(violation.timestamp).toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                          </p>
                          <p>{violation.location.address}</p>
                          <p className="text-sm text-slate-400">
                            {violation.location.lat.toFixed(6)}, {violation.location.lon.toFixed(6)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Violations Detected</p>
                          <div className="space-y-2">
                            {violation.violations.map((v, i) => (
                              <div key={i} className="bg-red-900/20 border border-red-700 p-3 rounded">
                                <div className="flex justify-between items-center">
                                  <span className="text-red-300">{v.type}</span>
                                  <span className="text-sm text-red-400">
                                    {(v.confidence * 100).toFixed(1)}% confidence
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Violation Statistics */}
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Violation Statistics
                </h2>
                
                {violations.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(getViolationStats()).map(([type, count]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">{type}</span>
                          <span className="font-bold text-blue-400">{count}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                            style={{ width: `${(count / violations.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Hotspots */}
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Map className="w-6 h-6 text-red-400" />
                  Violation Hotspots
                </h2>
                
                {violations.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {getLocationHotspots().map(([location, count], idx) => (
                      <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                            <span className="text-slate-300">{location}</span>
                          </div>
                          <span className="font-bold text-red-400 text-lg">{count}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${(count / Math.max(...getLocationHotspots().map(h => h[1]))) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border border-blue-500">
                <p className="text-blue-200 text-sm mb-2">Total Reports</p>
                <p className="text-4xl font-bold">{violations.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border border-red-500">
                <p className="text-red-200 text-sm mb-2">Total Violations</p>
                <p className="text-4xl font-bold">
                  {violations.reduce((sum, v) => sum + v.violations.length, 0)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-500">
                <p className="text-purple-200 text-sm mb-2">Avg Confidence</p>
                <p className="text-4xl font-bold">
                  {violations.length > 0 
                    ? (violations.reduce((sum, v) => 
                        sum + v.violations.reduce((s, viol) => s + viol.confidence, 0) / v.violations.length, 0
                      ) / violations.length * 100).toFixed(0) + '%'
                    : '0%'
                  }
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border border-green-500">
                <p className="text-green-200 text-sm mb-2">Hotspot Locations</p>
                <p className="text-4xl font-bold">{getLocationHotspots().length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficViolationSystem;