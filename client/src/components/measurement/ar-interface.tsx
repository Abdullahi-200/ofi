import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, ZoomIn, User } from "lucide-react";

interface ARInterfaceProps {
  currentMeasurement: string;
  onMeasurementComplete: (value: string) => void;
  isCompleted: boolean;
}

export default function ARInterface({ currentMeasurement, onMeasurementComplete, isCompleted }: ARInterfaceProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate measurement capture
    setTimeout(() => {
      const mockValue = Math.floor(Math.random() * 10) + 30;
      onMeasurementComplete(mockValue.toString());
      setIsCapturing(false);
    }, 2000);
  };

  if (isCompleted) {
    return (
      <Card className="p-8 text-center bg-green-50">
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Measurements Complete!</h3>
          <p className="text-gray-600 mb-6">Your body measurements have been saved successfully.</p>
          <Button className="bg-ofi-orange hover:bg-orange-600">
            View 3D Model
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 text-white relative overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-6">
          <Camera className="h-12 w-12 text-ofi-gold mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {isCapturing ? "Capturing..." : "AR Measurement Active"}
          </h3>
          <p className="text-gray-300">
            {isCapturing ? "Processing measurement..." : `Measuring: ${currentMeasurement}`}
          </p>
        </div>

        {/* Mock camera view */}
        <div className="bg-gray-800 rounded-lg p-8 relative min-h-64 flex items-center justify-center mb-6">
          <div className="border-2 border-dashed border-ofi-gold rounded-lg w-32 h-48 flex items-center justify-center">
            <User className="h-16 w-16 text-ofi-gold" />
          </div>
          
          {/* Measurement points overlay */}
          <div className="absolute top-4 left-4 bg-ofi-orange rounded-full w-3 h-3 animate-pulse"></div>
          <div className="absolute top-16 right-8 bg-ofi-orange rounded-full w-3 h-3 animate-pulse"></div>
          <div className="absolute bottom-16 left-8 bg-ofi-orange rounded-full w-3 h-3 animate-pulse"></div>

          {isCapturing && (
            <div className="absolute inset-0 bg-ofi-orange bg-opacity-20 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Analyzing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="sm" className="text-white border-gray-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Rotate
          </Button>
          <Button 
            className="bg-ofi-gold text-gray-900 hover:bg-yellow-500"
            onClick={handleCapture}
            disabled={isCapturing}
          >
            <Camera className="h-4 w-4 mr-2" />
            {isCapturing ? "Capturing..." : "Capture Measurement"}
          </Button>
          <Button variant="outline" size="sm" className="text-white border-gray-600">
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom
          </Button>
        </div>
      </div>
    </Card>
  );
}
