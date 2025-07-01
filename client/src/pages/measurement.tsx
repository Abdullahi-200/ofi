import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Check, Circle, RotateCcw, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AdvancedARScanner from "@/components/measurement/advanced-ar-scanner";
import { realTimeService } from "@/services/realtime";

type MeasurementStep = {
  id: string;
  name: string;
  completed: boolean;
  value?: string;
};

export default function Measurement() {
  const [currentStep, setCurrentStep] = useState(0);
  const [measurements, setMeasurements] = useState<MeasurementStep[]>([
    { id: "height", name: "Height", completed: false },
    { id: "chest", name: "Chest", completed: false },
    { id: "waist", name: "Waist", completed: false },
    { id: "hip", name: "Hip", completed: false },
    { id: "shoulder", name: "Shoulder Width", completed: false },
    { id: "arm", name: "Arm Length", completed: false },
    { id: "neck", name: "Neck", completed: false },
    { id: "inseam", name: "Inseam", completed: false },
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const completedCount = measurements.filter(m => m.completed).length;
  const progressPercentage = (completedCount / measurements.length) * 100;

  useEffect(() => {
    realTimeService.connect();
    
    // Listen for measurement updates
    const handleMeasurementUpdate = (data: any) => {
      setMeasurements(prev => prev.map(m => 
        m.id === data.measurementType 
          ? { ...m, completed: true, value: data.value }
          : m
      ));
    };

    realTimeService.on('measurement-updated', handleMeasurementUpdate);

    return () => {
      realTimeService.off('measurement-updated', handleMeasurementUpdate);
    };
  }, []);

  const handleMeasurementComplete = (measurementData: Record<string, string>) => {
    const updatedMeasurements = measurements.map(measurement => ({
      ...measurement,
      completed: true,
      value: measurementData[measurement.id] || `${Math.floor(Math.random() * 10) + 30}`
    }));
    setMeasurements(updatedMeasurements);
    
    // Emit real-time update
    realTimeService.updateMeasurement({
      userId: 1, // In real app, get from auth context
      measurements: measurementData,
      timestamp: new Date().toISOString()
    });
  };

  const startRealTimeScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate real-time scanning progress
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          
          // Complete current measurement with simulated AR value
          const simulatedValue = Math.floor(Math.random() * 20) + 30;
          handleSingleMeasurementComplete(`${simulatedValue} cm`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSingleMeasurementComplete = (value: string) => {
    const updatedMeasurements = [...measurements];
    updatedMeasurements[currentStep] = {
      ...updatedMeasurements[currentStep],
      completed: true,
      value,
    };
    setMeasurements(updatedMeasurements);

    if (currentStep < measurements.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isAllCompleted = completedCount === measurements.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            AI Body Measurement
          </h1>
          <p className="text-lg text-gray-600">
            Use your camera to get precise measurements in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Measurement Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Measurement Progress</span>
                  <span className="text-sm text-ofi-orange font-medium">
                    {completedCount} of {measurements.length} complete
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progressPercentage} className="mb-6" />
                <div className="space-y-3">
                  {measurements.map((measurement, index) => (
                    <div key={measurement.id} className="flex items-center">
                      {measurement.completed ? (
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 mr-3" />
                      )}
                      <span className={`flex-1 ${measurement.completed ? 'text-gray-700' : 'text-gray-400'}`}>
                        {measurement.name}
                        {measurement.value && `: ${measurement.value} inches`}
                      </span>
                      {index === currentStep && !measurement.completed && (
                        <span className="text-sm text-ofi-orange font-medium">Current</span>
                      )}
                    </div>
                  ))}
                </div>

                {!isAllCompleted ? (
                  <Button 
                    className="w-full bg-ofi-orange hover:bg-orange-600 mt-6"
                    onClick={() => handleSingleMeasurementComplete(`${Math.floor(Math.random() * 10) + 32}`)}
                  >
                    Continue Measuring
                  </Button>
                ) : (
                  <div className="space-y-4 mt-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">All measurements complete!</p>
                    </div>
                    <div className="flex gap-4">
                      <Link href="/style-quiz">
                        <Button className="bg-ofi-orange hover:bg-orange-600 flex-1">
                          Continue to Style Quiz
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1">
                        Save & Exit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Measurement Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Stand in good lighting for better accuracy
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Position yourself 6 feet from the camera
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Wear form-fitting clothes for best results
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Keep your arms at your sides
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AR Interface */}
          <div>
            <AdvancedARScanner 
              onMeasurementComplete={handleMeasurementComplete}
              currentStep={measurements[currentStep]?.id || "complete"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}