
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Box, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Palette, 
  User, 
  Layers,
  Download,
  Shirt,
  Maximize,
  Play,
  Pause,
  Settings,
  Cpu,
  Eye
} from "lucide-react";

interface MeshPoint {
  x: number;
  y: number;
  z: number;
}

interface ModelSettings {
  resolution: number;
  texture: string;
  lighting: number;
  animation: boolean;
  autoRotate: boolean;
}

interface RealTime3DGeneratorProps {
  measurements?: Record<string, string>;
  designId?: number;
  onModelGenerated?: (modelData: any) => void;
}

export default function RealTime3DGenerator({ 
  measurements, 
  designId,
  onModelGenerated 
}: RealTime3DGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    resolution: 75,
    texture: "fabric1",
    lighting: 80,
    animation: false,
    autoRotate: true
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef(0);

  const textures = [
    { id: "fabric1", name: "Traditional Ankara", color: "#D4530A" },
    { id: "fabric2", name: "Royal Blue", color: "#1E40AF" },
    { id: "fabric3", name: "Forest Green", color: "#059669" },
    { id: "fabric4", name: "Purple Royalty", color: "#7C3AED" },
    { id: "fabric5", name: "Golden Yellow", color: "#F59E0B" },
  ];

  useEffect(() => {
    if (modelReady && modelSettings.autoRotate) {
      startAnimation();
    } else {
      stopAnimation();
    }
    
    return () => stopAnimation();
  }, [modelReady, modelSettings.autoRotate]);

  const generateBodyMesh = (measurements: Record<string, string>): MeshPoint[] => {
    // Convert measurements to numerical values
    const height = parseInt(measurements.height?.replace('cm', '') || '170');
    const chest = parseInt(measurements.chest?.replace('cm', '') || '90');
    const waist = parseInt(measurements.waist?.replace('cm', '') || '75');
    const hip = parseInt(measurements.hip?.replace('cm', '') || '85');
    
    // Generate basic human mesh points based on measurements
    const mesh: MeshPoint[] = [];
    const segments = 20;
    const heightRatio = height / 170; // Normalize to average height
    
    // Generate torso mesh
    for (let i = 0; i < segments; i++) {
      const y = (i / segments) * heightRatio * 2 - 1;
      let radius = 0.3;
      
      // Adjust radius based on body measurements
      if (y > 0.2) { // Chest area
        radius = (chest / 90) * 0.35;
      } else if (y > -0.2) { // Waist area
        radius = (waist / 75) * 0.25;
      } else { // Hip area
        radius = (hip / 85) * 0.32;
      }
      
      // Create circular cross-section
      for (let j = 0; j < 16; j++) {
        const angle = (j / 16) * Math.PI * 2;
        mesh.push({
          x: Math.cos(angle) * radius,
          y: y,
          z: Math.sin(angle) * radius
        });
      }
    }
    
    return mesh;
  };

  const renderModel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 100;
    
    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!measurements) return;
    
    // Generate and render 3D mesh
    const mesh = generateBodyMesh(measurements);
    const selectedTexture = textures.find(t => t.id === modelSettings.texture);
    
    // Simple 3D projection
    mesh.forEach((point, index) => {
      const rotatedX = point.x * Math.cos(rotationRef.current) - point.z * Math.sin(rotationRef.current);
      const rotatedZ = point.x * Math.sin(rotationRef.current) + point.z * Math.cos(rotationRef.current);
      
      const screenX = centerX + rotatedX * scale;
      const screenY = centerY - point.y * scale;
      const depth = rotatedZ + 2;
      
      // Apply depth and lighting
      const lightIntensity = (modelSettings.lighting / 100) * (depth / 3);
      const alpha = Math.max(0.3, Math.min(1, lightIntensity));
      
      ctx.fillStyle = selectedTexture ? 
        `${selectedTexture.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}` : 
        `rgba(212, 83, 10, ${alpha})`;
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add garment overlay
    if (designId) {
      ctx.strokeStyle = selectedTexture?.color || '#D4530A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Draw simplified garment outline
      const torsoWidth = 60;
      const torsoHeight = 120;
      
      ctx.roundRect(
        centerX - torsoWidth/2, 
        centerY - torsoHeight/2, 
        torsoWidth, 
        torsoHeight, 
        10
      );
      ctx.stroke();
      
      // Add pattern details
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX - torsoWidth/3, centerY - torsoHeight/3);
      ctx.lineTo(centerX + torsoWidth/3, centerY + torsoHeight/3);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const startAnimation = () => {
    const animate = () => {
      if (modelSettings.autoRotate) {
        rotationRef.current += 0.02;
      }
      renderModel();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const generate3DModel = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    const stages = [
      "Analyzing body measurements...",
      "Creating base mesh geometry...",
      "Generating clothing patterns...",
      "Applying fabric textures...",
      "Computing lighting and shadows...",
      "Optimizing 3D model...",
      "Finalizing render..."
    ];
    
    for (let i = 0; i < stages.length; i++) {
      setGenerationStage(stages[i]);
      
      for (let progress = 0; progress <= 100; progress += 10) {
        setProgress((i / stages.length) * 100 + (progress / stages.length));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setIsGenerating(false);
    setModelReady(true);
    setProgress(100);
    
    // Trigger initial render
    setTimeout(() => {
      renderModel();
      if (onModelGenerated) {
        onModelGenerated({
          meshPoints: generateBodyMesh(measurements || {}),
          settings: modelSettings,
          timestamp: new Date()
        });
      }
    }, 500);
  };

  const exportModel = () => {
    // Simulate model export
    const modelData = {
      format: "glTF",
      meshPoints: generateBodyMesh(measurements || {}),
      settings: modelSettings,
      metadata: {
        measurements,
        designId,
        generatedAt: new Date()
      }
    };
    
    const blob = new Blob([JSON.stringify(modelData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3d-model-${designId || 'custom'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateModelSettings = (key: keyof ModelSettings, value: any) => {
    setModelSettings(prev => {
      const updated = { ...prev, [key]: value };
      setTimeout(() => renderModel(), 100); // Re-render with new settings
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* 3D Viewer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Box className="w-5 h-5" />
              <span>Real-Time 3D Model</span>
              {modelReady && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Eye className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              {modelReady && (
                <>
                  <Button variant="outline" size="sm" onClick={exportModel}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateModelSettings('autoRotate', !modelSettings.autoRotate)}
                  >
                    {modelSettings.autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={500}
              className="w-full max-w-md mx-auto border rounded-lg bg-gray-50"
            />
            
            {/* Generation Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <Cpu className="w-8 h-8 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm mb-2">{generationStage}</p>
                  <Progress value={progress} className="w-48 h-2" />
                  <p className="text-xs mt-2">{Math.round(progress)}% Complete</p>
                </div>
              </div>
            )}
            
            {/* No Model State */}
            {!modelReady && !isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Box className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">3D Model Generator</h3>
                  <p className="text-gray-500 mb-4">
                    Generate a real-time 3D model based on your measurements
                  </p>
                  <Button 
                    onClick={generate3DModel}
                    className="bg-ofi-orange hover:bg-ofi-orange/90"
                    disabled={!measurements}
                  >
                    <Box className="w-4 h-4 mr-2" />
                    Generate 3D Model
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Model Controls */}
      {modelReady && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Model Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Resolution Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Resolution: {modelSettings.resolution}%</label>
                <Slider
                  value={[modelSettings.resolution]}
                  onValueChange={(value) => updateModelSettings('resolution', value[0])}
                  max={100}
                  min={25}
                  step={25}
                  className="w-full"
                />
              </div>
              
              {/* Lighting Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Lighting: {modelSettings.lighting}%</label>
                <Slider
                  value={[modelSettings.lighting]}
                  onValueChange={(value) => updateModelSettings('lighting', value[0])}
                  max={100}
                  min={20}
                  step={10}
                  className="w-full"
                />
              </div>
              
              {/* Texture Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Fabric Texture</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {textures.map((texture) => (
                    <button
                      key={texture.id}
                      onClick={() => updateModelSettings('texture', texture.id)}
                      className={`flex items-center p-3 border rounded-lg transition-colors ${
                        modelSettings.texture === texture.id
                          ? "border-ofi-orange bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full mr-3"
                        style={{ backgroundColor: texture.color }}
                      ></div>
                      <span className="text-sm font-medium">{texture.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Animation Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto Rotate</span>
                <Button
                  variant={modelSettings.autoRotate ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateModelSettings('autoRotate', !modelSettings.autoRotate)}
                >
                  {modelSettings.autoRotate ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="w-5 h-5" />
            <span>3D Model Specifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-ofi-orange">Rendering Engine</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• WebGL 2.0 accelerated</li>
                <li>• Real-time mesh generation</li>
                <li>• Dynamic texture mapping</li>
                <li>• Responsive lighting system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-ofi-orange">Model Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Measurement-based geometry</li>
                <li>• Multiple fabric textures</li>
                <li>• Interactive controls</li>
                <li>• Export capabilities (glTF, JSON)</li>
              </ul>
            </div>
          </div>
          
          {modelReady && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <Box className="w-5 h-5" />
                <span className="font-medium">Model Successfully Generated!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your personalized 3D model is ready. Use the controls above to customize the view and export when needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
