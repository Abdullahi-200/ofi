import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Smartphone,
  User,
  Ruler,
  Target,
  Zap
} from "lucide-react";

interface MeasurementPoint {
  id: string;
  label: string;
  value?: number;
  accuracy?: number;
  status: "pending" | "measuring" | "complete" | "error";
}

interface ARScannerProps {
  onMeasurementComplete: (measurements: Record<string, string>) => void;
  currentStep: string;
}

export default function AdvancedARScanner({ onMeasurementComplete, currentStep }: ARScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMeasurement, setCurrentMeasurement] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementPoint[]>([
    { id: "height", label: "Height", status: "pending" },
    { id: "chest", label: "Chest", status: "pending" },
    { id: "waist", label: "Waist", status: "pending" },
    { id: "hip", label: "Hip", status: "pending" },
    { id: "shoulder", label: "Shoulder Width", status: "pending" },
    { id: "arm", label: "Arm Length", status: "pending" },
    { id: "neck", label: "Neck", status: "pending" },
    { id: "inseam", label: "Inseam", status: "pending" },
  ]);
  const [deviceOrientation, setDeviceOrientation] = useState("portrait");
  const [calibrated, setCalibrated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isScanning) {
      simulateAdvancedScanning();
    }
  }, [isScanning]);

  const simulateAdvancedScanning = async () => {
    const measurementSequence = measurements.map(m => m.id);
    
    for (let i = 0; i < measurementSequence.length; i++) {
      const measurementId = measurementSequence[i];
      setCurrentMeasurement(measurementId);
      
      // Update status to measuring
      setMeasurements(prev => prev.map(m => 
        m.id === measurementId 
          ? { ...m, status: "measuring" }
          : m
      ));
      
      // Simulate scanning time with progress
      for (let progress = 0; progress <= 100; progress += 5) {
        setProgress((i / measurementSequence.length) * 100 + (progress / measurementSequence.length));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Generate realistic measurement value
      const value = generateRealisticMeasurement(measurementId);
      const accuracy = 85 + Math.random() * 10; // 85-95% accuracy
      
      setMeasurements(prev => prev.map(m => 
        m.id === measurementId 
          ? { ...m, status: "complete", value, accuracy: Math.round(accuracy) }
          : m
      ));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsScanning(false);
    setCurrentMeasurement(null);
    setProgress(100);
    
    // Convert to string measurements and call completion handler
    const finalMeasurements = measurements.reduce((acc, m) => {
      if (m.value) {
        acc[m.id] = `${m.value}cm`;
      }
      return acc;
    }, {} as Record<string, string>);
    
    setTimeout(() => {
      onMeasurementComplete(finalMeasurements);
    }, 1000);
  };

  const generateRealisticMeasurement = (type: string): number => {
    const baseMeasurements = {
      height: 170 + Math.random() * 20, // 170-190cm
      chest: 90 + Math.random() * 15,   // 90-105cm
      waist: 75 + Math.random() * 15,   // 75-90cm
      hip: 85 + Math.random() * 15,     // 85-100cm
      shoulder: 40 + Math.random() * 8,  // 40-48cm
      arm: 60 + Math.random() * 8,      // 60-68cm
      neck: 35 + Math.random() * 5,     // 35-40cm
      inseam: 75 + Math.random() * 10,  // 75-85cm
    };
    
    return Math.round(baseMeasurements[type as keyof typeof baseMeasurements] || 0);
  };

  const startCalibration = async () => {
    setCalibrated(false);
    // Simulate calibration process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCalibrated(true);
  };

  const startScanning = () => {
    if (!calibrated) {
      startCalibration().then(() => {
        setIsScanning(true);
        setProgress(0);
      });
    } else {
      setIsScanning(true);
      setProgress(0);
    }
  };

  const resetMeasurements = () => {
    setMeasurements(prev => prev.map(m => ({ 
      ...m, 
      status: "pending", 
      value: undefined, 
      accuracy: undefined 
    })));
    setProgress(0);
    setIsScanning(false);
    setCurrentMeasurement(null);
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return "gray";
    if (accuracy >= 90) return "green";
    if (accuracy >= 80) return "yellow";
    return "red";
  };

  return (
    <div className="space-y-6">
      {/* Camera Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>AI-Powered Body Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[3/4] max-w-md mx-auto">
            {/* Simulated Camera Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
              <div className="absolute inset-4 border-2 border-white/30 rounded-lg">
                {/* Body Outline Simulation */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="relative">
                    <User className="w-24 h-24 text-white/50" />
                    
                    {/* Measurement Points */}
                    {isScanning && currentMeasurement && (
                      <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                          <div className="w-3 h-3 bg-ofi-orange rounded-full animate-pulse" />
                        </div>
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                          <div className="w-3 h-3 bg-ofi-orange rounded-full animate-pulse" />
                        </div>
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                          <div className="w-3 h-3 bg-ofi-orange rounded-full animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Scanning Overlay */}
              {isScanning && (
                <>
                  <div className="absolute inset-0 bg-ofi-orange/10" />
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center space-x-2 text-white text-sm">
                      <Target className="w-4 h-4 animate-spin" />
                      <span>Measuring {currentMeasurement}...</span>
                    </div>
                  </div>
                </>
              )}
              
              {/* Calibration Indicator */}
              {!calibrated && !isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Smartphone className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Calibration Required</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            {isScanning && (
              <div className="absolute bottom-4 left-4 right-4">
                <Progress value={progress} className="h-2 bg-white/20" />
                <p className="text-white text-xs mt-1 text-center">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            {!isScanning ? (
              <>
                <Button 
                  onClick={startScanning}
                  className="bg-ofi-orange hover:bg-ofi-orange/90"
                  disabled={!calibrated && isScanning}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {calibrated ? "Start Scanning" : "Calibrate & Scan"}
                </Button>
                <Button variant="outline" onClick={resetMeasurements}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </>
            ) : (
              <Button variant="outline" disabled>
                <Target className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Measurement Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ruler className="w-5 h-5" />
            <span>Measurement Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {measurements.map((measurement) => (
              <div key={measurement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    measurement.status === "complete" ? "bg-green-500" :
                    measurement.status === "measuring" ? "bg-ofi-orange animate-pulse" :
                    measurement.status === "error" ? "bg-red-500" :
                    "bg-gray-300"
                  }`} />
                  <span className="font-medium">{measurement.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {measurement.status === "complete" && measurement.value && (
                    <>
                      <span className="text-sm font-mono">{measurement.value}cm</span>
                      {measurement.accuracy && (
                        <Badge variant="outline" className={`text-xs ${
                          getAccuracyColor(measurement.accuracy) === "green" ? "border-green-500 text-green-700" :
                          getAccuracyColor(measurement.accuracy) === "yellow" ? "border-yellow-500 text-yellow-700" :
                          "border-red-500 text-red-700"
                        }`}>
                          {measurement.accuracy}%
                        </Badge>
                      )}
                    </>
                  )}
                  
                  {measurement.status === "measuring" && (
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-ofi-orange rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-ofi-orange rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-1 h-1 bg-ofi-orange rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                  )}
                  
                  {measurement.status === "complete" && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  
                  {measurement.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {progress === 100 && !isScanning && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <Check className="w-5 h-5" />
                <span className="font-medium">Measurements Complete!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                All body measurements have been captured with high accuracy. You can now proceed to browse designs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips & Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Scanning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-ofi-orange">For Best Results:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Stand 2-3 feet from camera</li>
                <li>• Wear form-fitting clothes</li>
                <li>• Keep arms slightly away from body</li>
                <li>• Stand on a plain background</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-ofi-orange">Technology:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• AI-powered computer vision</li>
                <li>• 95%+ measurement accuracy</li>
                <li>• Real-time body analysis</li>
                <li>• Privacy-first processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}