import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Camera, Upload, FileText, BarChart3, MapPin, Download, Play, Pause, Square, AlertTriangle, Shield, Eye } from 'lucide-react';

const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

const TrafficViolationSystem = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [reports, setReports] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamPaused, setWebcamPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('cam_01');
  const [selectedZone, setSelectedZone] = useState('Central Bengaluru');
  const [filterViolationType, setFilterViolationType] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('all');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const detectViolations = useCallback((imgUrl) => {
    const types = [
      { type: 'Helmetless Riding', severity: 'High' },
      { type: 'Wrong-side Driving', severity: 'Critical' },
      { type: 'Signal Jumping', severity: 'Critical' },
      { type: 'Triple Riding', severity: 'Medium' }
    ];
    
    let seed = 0;
    for (let i = 0; i < Math.min(32, imgUrl.length); i++) {
      seed += imgUrl.charCodeAt(i);
    }
    
    const rng = seededRandom(seed);
    const num = Math.floor(rng() * 5);
    const violations = [];
    const used = new Set();
    
    for (let i = 0; i < num; i++) {
      let vType;
      do {
        vType = types[Math.floor(rng() * types.length)];
      } while (used.has(vType.type));
      used.add(vType.type);
      
      violations.push({
        type: vType.type,
        severity: vType.severity,
        confidence: 0.75 + rng() * 0.15,
        bbox: { x: rng() * 0.5, y: rng() * 0.5, w: 0.2 + rng() * 0.25, h: 0.2 + rng() * 0.25 }
      });
    }
    return violations;
  }, []);

  const getLocation = () => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, address: 'Live Location', zone: 'Detected Zone' }),
          () => {
            const zones = [
              { name: 'Central Bengaluru', lat: 12.9716, lon: 77.5946, address: 'MG Road, Brigade Road' },
              { name: 'North Bengaluru', lat: 13.0358, lon: 77.5970, address: 'Whitefield, Marathahalli' },
              { name: 'South Bengaluru', lat: 12.9141, lon: 77.6111, address: 'Koramangala, BTM Layout' }
            ];
            const z = zones[Math.floor(Math.random() * zones.length)];
            resolve({ lat: z.lat, lon: z.lon, address: z.address, zone: z.name });
          },
          { enableHighAccuracy: true }
        );
      } else {
        resolve({ lat: 12.9716, lon: 77.5946, address: 'MG Road, Brigade Road', zone: 'Central Bengaluru' });
      }
    });
  };

  const drawCanvas = (imgUrl, violations, reportId, timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, 'rgba(234, 88, 12, 0.95)');
      grad.addColorStop(1, 'rgba(249, 115, 22, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, 50);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('TrafficGuard AI', 15, 25);
      ctx.font = '12px sans-serif';
      ctx.fillText(`${reportId} | ${new Date(timestamp).toLocaleString()}`, 15, 40);
      
      if (violations.length > 0) {
        const bx = canvas.width - 140;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillRect(bx, 10, 130, 30);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`${violations.length} Violation${violations.length > 1 ? 's' : ''}`, bx + 10, 30);
      }
      
      violations.forEach((v) => {
        if (v.bbox) {
          const x = v.bbox.x * canvas.width;
          const y = v.bbox.y * canvas.height;
          const w = v.bbox.w * canvas.width;
          const h = v.bbox.h * canvas.height;
          
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, w, h);
          
          ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.fillRect(x, y - 28, w, 28);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(v.type, x + 5, y - 14);
          ctx.font = '10px sans-serif';
          ctx.fillText(`${(v.confidence * 100).toFixed(0)}% | ${v.severity}`, x + 5, y - 4);
        }
      });
    };
    img.src = imgUrl;
  };

  const analyzeImage = async (imgUrl) => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const violations = detectViolations(imgUrl);
    const location = await getLocation();
    const reportId = `TG${Date.now().toString().slice(-8)}`;
    const timestamp = new Date().toISOString();
    
    const result = { reportId, timestamp, location, violations, imageDataUrl: imgUrl };
    setCurrentResult(result);
    drawCanvas(imgUrl, violations, reportId, timestamp);
    setReports(prev => [result, ...prev]);
    setIsAnalyzing(false);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => analyzeImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => handleFile(e.target.files?.[0]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            handleFile(items[i].getAsFile());
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setWebcamActive(true);
      setWebcamPaused(false);
    } catch (err) {
      alert('Camera access denied');
    }
  };

  const pauseWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.enabled = false);
      setWebcamPaused(true);
    }
  };

  const resumeWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.enabled = true);
      setWebcamPaused(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setWebcamActive(false);
    setWebcamPaused(false);
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      analyzeImage(canvas.toDataURL('image/jpeg', 0.95));
    }
  };

  const exportJSON = (report) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrafficGuard_${report.reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = (report) => {
    const rows = [
      ['Report ID', report.reportId],
      ['Timestamp', new Date(report.timestamp).toLocaleString()],
      ['Zone', report.location.zone],
      ['Location', report.location.address],
      [],
      ['Violation', 'Severity', 'Confidence'],
      ...report.violations.map(v => [v.type, v.severity, (v.confidence * 100).toFixed(1) + '%'])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrafficGuard_${report.reportId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TrafficGuard_${currentResult.reportId}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const analytics = useMemo(() => {
    const vCounts = {};
    const lCounts = {};
    let total = 0;
    let confSum = 0;
    
    reports.forEach(r => {
      r.violations.forEach(v => {
        vCounts[v.type] = (vCounts[v.type] || 0) + 1;
        total++;
        confSum += v.confidence;
      });
      const loc = r.location.zone || r.location.address;
      lCounts[loc] = (lCounts[loc] || 0) + r.violations.length;
    });
    
    const hotspots = Object.entries(lCounts).map(([loc, cnt]) => ({ location: loc, count: cnt })).sort((a, b) => b.count - a.count);
    
    return {
      vCounts,
      hotspots,
      totalReports: reports.length,
      totalViolations: total,
      avgConf: total > 0 ? (confSum / total * 100).toFixed(1) : 0,
      uniqueLocs: hotspots.length
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100">
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">TrafficGuard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-600 hover:text-orange-600 font-medium text-sm">Login</button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium text-sm">Sign Up</button>
            </div>
          </div>
        </div>
      </header>

      {activeTab === 'landing' && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Welcome to Smarter Traffic Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Smart Traffic<br />Management for<br />
              <span className="text-orange-500">Bengaluru</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Leveraging advanced technology to make Bengaluru's roads safer, smarter, and more efficient through intelligent traffic violation detection and real-time management.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('detection')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </button>
              <button className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Learn More
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md border border-orange-200">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">AI Detection</h3>
                <p className="text-sm text-slate-600">Real-time violation detection using advanced computer vision</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-orange-200">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Analytics</h3>
                <p className="text-sm text-slate-600">Comprehensive insights and hotspot identification</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-orange-200">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Location Based</h3>
                <p className="text-sm text-slate-600">Geo-tagged reports for precise enforcement</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-orange-200">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Safer Roads</h3>
                <p className="text-sm text-slate-600">Reduce accidents and improve traffic safety</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'landing' && (
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">TrafficGuard</h1>
                  <p className="text-orange-100 text-sm">Smart Traffic Management for Bengaluru</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-2xl">{reports.length}</div>
                  <div className="text-orange-100">Reports</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl">{analytics.totalViolations}</div>
                  <div className="text-orange-100">Violations</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl">{analytics.avgConf}%</div>
                  <div className="text-orange-100">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab !== 'landing' && (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-orange-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-orange-600 mb-2">OUR VISION</h3>
                  <h2 className="text-2xl font-bold mb-3">A Safer <span className="text-orange-600">Bengaluru</span></h2>
                  <p className="text-slate-600">We envision a city where traffic violations are minimized through intelligent detection and real-time enforcement, creating safer roads for every citizen and reducing accidents caused by traffic rule violations.</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-orange-600 mb-2">OUR MISSION</h3>
                  <h2 className="text-2xl font-bold mb-3">Intelligent Traffic <span className="text-orange-600">Management</span></h2>
                  <p className="text-slate-600">Our mission is to deploy cutting-edge AI and computer vision technology to detect traffic violations in real-time, enabling authorities to enforce rules effectively and make our roads safer for everyone.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-center mb-2">Report & Fetch Violations in <span className="text-orange-600">Bengaluru</span></h2>
              <p className="text-center text-slate-600 mb-8">Easy access to report and check traffic violations across major zones in Bengaluru</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Central Bengaluru', address: 'MG Road, Cubbon Park, Brigade Road' },
                  { name: 'North Bengaluru', address: 'Whitefield, Indiranagar, Marathahalli' },
                  { name: 'South Bengaluru', address: 'Koramangala, BTM Layout, Jayanagar' },
                  { name: 'East Bengaluru', address: 'C V Raman, Panathur Nagar, Purana Palya' },
                  { name: 'West Bengaluru', address: 'Yeshwanthpur, Jalahalli, Rajarajnagar' },
                  { name: 'Electronic City', address: 'ITPL Area, Outer Ring Road, Sarjapur Road' }
                ].map((zone) => (
                  <div key={zone.name} className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-lg border border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-500 group-hover:bg-orange-600 p-2 rounded-lg transition-colors">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{zone.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{zone.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-md p-8 mb-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-center mb-2">See Our System in <span className="text-orange-600">Action</span></h2>
              <p className="text-center text-slate-600 mb-8">Watch how our AI-powered technology detects and reports traffic violations in real-time</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-orange-200">
                  <div className="relative">
                    <img 
                      src="https://i.imgur.com/placeholder1.jpg"
                      alt="Multi-lane detection"
                      className="w-full h-48 object-cover bg-slate-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-slate-200">
                      <div className="text-center p-4">
                        <Camera className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500">Multi-lane Detection Example</p>
                        <p className="text-xs text-slate-400 mt-1">Upload your traffic images to see detection</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2">Multi-Lane Detection</h3>
                    <p className="text-sm text-slate-600 mb-3">Advanced lane monitoring with zone-based violation detection across multiple traffic lanes</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">3 Vehicles</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Lane Tracking</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-orange-200">
                  <div className="relative">
                    <img 
                      src="https://i.imgur.com/placeholder2.jpg"
                      alt="Signal violation detection"
                      className="w-full h-48 object-cover bg-slate-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-slate-200">
                      <div className="text-center p-4">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500">Signal Violation Example</p>
                        <p className="text-xs text-slate-400 mt-1">Real-time signal jump detection</p>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Signal Zone
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2">Signal Jump Detection</h3>
                    <p className="text-sm text-slate-600 mb-3">Real-time monitoring of traffic signal violations with precise timestamp recording</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">2 Detected</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Critical</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-orange-200">
                  <div className="relative">
                    <img 
                      src="https://i.imgur.com/placeholder3.jpg"
                      alt="Illegal parking detection"
                      className="w-full h-48 object-cover bg-slate-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-slate-200">
                      <div className="text-center p-4">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500">Illegal Parking Example</p>
                        <p className="text-xs text-slate-400 mt-1">Duration tracking enabled</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      15 min
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2">Illegal Parking Monitor</h3>
                    <p className="text-sm text-slate-600 mb-3">Automatic detection of unauthorized parking with duration tracking and zone mapping</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">15m Duration</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Recorded</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setActiveTab('monitoring')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Try Live Monitoring Now
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { id: 'monitoring', icon: Eye, label: 'Live Monitoring' },
                { id: 'detection', icon: Camera, label: 'Quick Detection' },
                { id: 'reports', icon: FileText, label: `Reports (${reports.length})` },
                { id: 'analytics', icon: BarChart3, label: 'Analytics' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-semibold transition-all rounded-t-xl whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
                  }`}
                >
                  <tab.icon className="inline-block w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'monitoring' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-orange-200">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-xl">
                <h2 className="text-white font-bold text-lg mb-4">Live Camera Feed</h2>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-white text-xs mb-1 block">Zone</label>
                    <select 
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full bg-slate-600 text-white px-3 py-2 rounded text-sm"
                    >
                      <option>Central Bengaluru</option>
                      <option>North Bengaluru</option>
                      <option>South Bengaluru</option>
                      <option>East Bengaluru</option>
                      <option>West Bengaluru</option>
                      <option>Electronic City</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white text-xs mb-1 block">Camera ID</label>
                    <select 
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full bg-slate-600 text-white px-3 py-2 rounded text-sm"
                    >
                      <option>cam_01</option>
                      <option>cam_02</option>
                      <option>cam_03</option>
                      <option>cam_04</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-600 p-2 rounded">
                    <div className="text-slate-300">Camera ID</div>
                    <div className="text-white font-semibold">{selectedCamera}</div>
                  </div>
                  <div className="bg-slate-600 p-2 rounded">
                    <div className="text-slate-300">Address</div>
                    <div className="text-white font-semibold">MG Road</div>
                  </div>
                  <div className="bg-slate-600 p-2 rounded">
                    <div className="text-slate-300">Total Records</div>
                    <div className="text-white font-semibold">{reports.length}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!webcamActive ? (
                  <div className="relative bg-slate-900 rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="w-16 h-16 text-slate-600 mb-4" />
                      <button
                        onClick={startWebcam}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Start Live Monitoring
                      </button>
                      <p className="text-slate-500 text-sm mt-3">Camera feed will appear here</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full" />
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {new Date().toLocaleTimeString()}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Signal Violation Zone
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={webcamPaused ? resumeWebcam : pauseWebcam} className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm">
                        {webcamPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        {webcamPaused ? 'Resume' : 'Pause'}
                      </button>
                      <button onClick={captureFrame} className="bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm">
                        <Camera className="w-4 h-4" />
                        Capture
                      </button>
                      <button onClick={stopWebcam} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm">
                        <Square className="w-4 h-4" />
                        Stop
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Violations</h3>
                <button className="text-orange-600 text-sm hover:underline">Refresh</button>
              </div>

              {reports.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reports.slice(0, 10).map((r) => (
                    <div key={r.reportId} className="border border-orange-200 rounded-lg p-3 hover:bg-orange-50 cursor-pointer">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="bg-red-100 p-1 rounded">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</p>
                          <p className="text-xs font-mono text-slate-700">Car ID: {r.reportId.slice(-4)}</p>
                        </div>
                      </div>
                      <img src={r.imageDataUrl} alt="Violation" className="w-full h-20 object-cover rounded mb-2" />
                      <div className="space-y-1">
                        {r.violations.map((v, i) => (
                          <div key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                            • {v.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-slate-500 text-sm">No violations detected</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'detection' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-orange-600" />
                Image Capture
              </h2>
              
              <div className="space-y-6">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                >
                  <Upload className="w-5 h-5" />
                  Upload Image File
                </button>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                    isDragging ? 'border-orange-500 bg-orange-50 scale-105' : 'border-orange-300 bg-gradient-to-br from-orange-50 to-white'
                  }`}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                  <p className="text-slate-700 font-medium mb-2">Drag & Drop Image Here</p>
                  <p className="text-sm text-slate-500">or use Ctrl+V to paste</p>
                </div>

                <div className="border-t-2 border-orange-100 pt-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-600" />
                    Live Camera Feed
                  </h3>
                  
                  {!webcamActive ? (
                    <button
                      onClick={startWebcam}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                    >
                      <Play className="w-5 h-5" />
                      Activate Camera
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black shadow-lg" />
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={webcamPaused ? resumeWebcam : pauseWebcam} className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                          {webcamPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          {webcamPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button onClick={captureFrame} className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                          <Camera className="w-4 h-4" />
                          Capture
                        </button>
                        <button onClick={stopWebcam} className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                          <Square className="w-4 h-4" />
                          Stop
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                Detection Results
              </h2>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">Analyzing image...</p>
                </div>
              ) : currentResult ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-200">
                      <p className="text-xs font-semibold text-orange-600 mb-1">REPORT ID</p>
                      <p className="font-mono font-bold text-orange-700">{currentResult.reportId}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-200">
                      <p className="text-xs font-semibold text-orange-600 mb-1">VIOLATIONS</p>
                      <p className="font-bold text-orange-700">{currentResult.violations.length} Detected</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-600 mb-1">LOCATION</p>
                        <p className="font-medium text-sm">{currentResult.location.zone}</p>
                        <p className="text-xs text-slate-600">{currentResult.location.address}</p>
                        <a
                          href={`https://www.google.com/maps?q=${currentResult.location.lat},${currentResult.location.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 inline-block"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-orange-700 mb-3">Violations Detected</h3>
                    {currentResult.violations.length > 0 ? (
                      <div className="space-y-2">
                        {currentResult.violations.map((v, i) => (
                          <div key={i} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-sm">{v.type}</span>
                              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">{v.severity}</span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-slate-600">Confidence</span>
                              <span className="text-xs font-semibold">{(v.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-orange-200 rounded-full h-2">
                              <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${v.confidence * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">No violations detected</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-orange-700 mb-3">Annotated Evidence</h3>
                    <canvas ref={canvasRef} className="w-full rounded-lg border-2 border-orange-200" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => exportJSON(currentResult)} className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      JSON
                    </button>
                    <button onClick={() => exportCSV(currentResult)} className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                    <button onClick={exportPNG} className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      PNG
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-orange-300" />
                  <p className="text-slate-500">Upload or capture an image to begin</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-orange-700">Violation Reports</h2>
              
              <div className="flex gap-3">
                <select 
                  value={filterViolationType}
                  onChange={(e) => setFilterViolationType(e.target.value)}
                  className="border border-orange-200 px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">All Violations</option>
                  <option value="Helmetless Riding">Helmetless Riding</option>
                  <option value="Wrong-side Driving">Wrong-side Driving</option>
                  <option value="Signal Jumping">Signal Jumping</option>
                  <option value="Triple Riding">Triple Riding</option>
                </select>

                <select 
                  value={filterTimeRange}
                  onChange={(e) => setFilterTimeRange(e.target.value)}
                  className="border border-orange-200 px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {reports.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports
                  .filter(r => {
                    if (filterViolationType === 'all') return true;
                    return r.violations.some(v => v.type === filterViolationType);
                  })
                  .filter(r => {
                    if (filterTimeRange === 'all') return true;
                    const reportDate = new Date(r.timestamp);
                    const now = new Date();
                    if (filterTimeRange === 'today') {
                      return reportDate.toDateString() === now.toDateString();
                    }
                    if (filterTimeRange === 'week') {
                      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return reportDate >= weekAgo;
                    }
                    if (filterTimeRange === 'month') {
                      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                      return reportDate >= monthAgo;
                    }
                    return true;
                  })
                  .map((r) => (
                  <div key={r.reportId} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <img src={r.imageDataUrl} alt="Evidence" className="w-full h-40 object-cover rounded mb-3" />
                    <p className="font-mono text-sm font-bold text-orange-700 mb-2">{r.reportId}</p>
                    <p className="text-xs text-slate-600 mb-2">{new Date(r.timestamp).toLocaleString()}</p>
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{r.location.zone}</p>
                        <a href={`https://www.google.com/maps?q=${r.location.lat},${r.location.lon}`} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 underline">View Map</a>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-orange-700 mb-1">Violations ({r.violations.length})</p>
                      <div className="space-y-1">
                        {r.violations.map((v, i) => (
                          <p key={i} className="text-xs text-slate-600">• {v.type}</p>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => exportJSON(r)} className="bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded text-xs font-medium">JSON</button>
                      <button onClick={() => exportCSV(r)} className="bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded text-xs font-medium">CSV</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500">No reports yet. Run a detection first.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-6">Analytics Dashboard</h2>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4">
                <p className="text-white/80 text-xs mb-1">TOTAL REPORTS</p>
                <p className="text-3xl font-bold">{analytics.totalReports}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4">
                <p className="text-white/80 text-xs mb-1">TOTAL VIOLATIONS</p>
                <p className="text-3xl font-bold">{analytics.totalViolations}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-700 to-orange-800 text-white rounded-lg p-4">
                <p className="text-white/80 text-xs mb-1">AVG CONFIDENCE</p>
                <p className="text-3xl font-bold">{analytics.avgConf}%</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg p-4">
                <p className="text-white/80 text-xs mb-1">HOTSPOT LOCATIONS</p>
                <p className="text-3xl font-bold">{analytics.uniqueLocs}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                <h3 className="font-bold text-orange-700 mb-4">Violations by Type</h3>
                {Object.keys(analytics.vCounts).length === 0 ? (
                  <p className="text-slate-500">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(analytics.vCounts).map(([type, count]) => (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{type}</span>
                          <span className="text-orange-700 font-semibold">{count}</span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(count / Math.max(1, analytics.totalViolations)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                <h3 className="font-bold text-orange-700 mb-4">Violation Hotspots</h3>
                {analytics.hotspots.length === 0 ? (
                  <p className="text-slate-500">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const max = Math.max(...analytics.hotspots.map(h => h.count));
                      return analytics.hotspots.map(h => (
                        <div key={h.location}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium truncate">{h.location}</span>
                            <span className="text-orange-700 font-semibold">{h.count}</span>
                          </div>
                          <div className="w-full bg-orange-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(h.count / Math.max(1, max)) * 100}%` }} />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Data shown is simulated for demo purposes. In production, this would connect to real AI models.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficViolationSystem;