import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, Palette, User } from "lucide-react";

interface ModelViewerProps {
  designId: number;
}

export default function ModelViewer({ designId }: ModelViewerProps) {
  const [currentView, setCurrentView] = useState(0);
  const [selectedColor, setSelectedColor] = useState("original");

  const views = ["Front", "Side", "Back", "3/4 View"];
  const colors = [
    { id: "original", name: "Original", color: "#D4530A" },
    { id: "blue", name: "Royal Blue", color: "#1E40AF" },
    { id: "green", name: "Forest Green", color: "#059669" },
    { id: "purple", name: "Purple", color: "#7C3AED" },
  ];

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-center">3D Model Preview</CardTitle>
        <p className="text-center text-gray-600">
          See how this design will look on your body measurements
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 min-h-96 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="h-16 w-16 text-ofi-orange" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">3D Model Preview</h3>
                <p className="text-gray-600 mb-6">Your personalized avatar</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Rotate
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4 mr-2" />
                    Zoom
                  </Button>
                </div>
              </div>
              
              {/* Mock clothing overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div 
                  className="w-24 h-32 rounded-lg transform rotate-3"
                  style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.color }}
                ></div>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              {views.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentView(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentView === index ? "bg-ofi-orange" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Features */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Model Features</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Accurate fit prediction</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Multiple angle views</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Color and pattern options</span>
                </div>
              </div>
            </div>

            {/* Color Options */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Color Options
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`flex items-center p-3 border rounded-lg transition-colors ${
                      selectedColor === color.id
                        ? "border-ofi-orange bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full mr-3"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <span className="text-sm font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Measurements Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Your Measurements</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Chest:</span>
                  <span className="font-medium ml-2">42"</span>
                </div>
                <div>
                  <span className="text-gray-600">Waist:</span>
                  <span className="font-medium ml-2">34"</span>
                </div>
                <div>
                  <span className="text-gray-600">Hip:</span>
                  <span className="font-medium ml-2">38"</span>
                </div>
                <div>
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium ml-2">5'10"</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-ofi-orange hover:bg-orange-600">
                Try On Design
              </Button>
              <Button variant="outline" className="w-full">
                Update Measurements
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
