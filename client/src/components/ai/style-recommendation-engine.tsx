import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Palette, 
  User, 
  Calendar,
  Heart,
  Star,
  RefreshCw
} from "lucide-react";

interface StyleProfile {
  bodyType: string;
  colorPreferences: string[];
  occasions: string[];
  stylePersonality: string;
  budgetRange: string;
}

interface RecommendedDesign {
  id: number;
  name: string;
  image: string;
  price: string;
  category: string;
  matchScore: number;
  reasonsForRecommendation: string[];
  tailorName: string;
  tailorRating: string;
  estimatedDelivery: string;
}

interface StyleRecommendationEngineProps {
  userProfile?: StyleProfile;
  measurements?: Record<string, string>;
  onRecommendationSelect: (design: RecommendedDesign) => void;
}

export default function StyleRecommendationEngine({ 
  userProfile, 
  measurements, 
  onRecommendationSelect 
}: StyleRecommendationEngineProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<RecommendedDesign[]>([]);
  const [currentTrends, setCurrentTrends] = useState<string[]>([]);
  const [analysisStage, setAnalysisStage] = useState<string>("");

  useEffect(() => {
    if (userProfile && measurements) {
      generateRecommendations();
    }
  }, [userProfile, measurements]);

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const stages = [
      "Analyzing body measurements...",
      "Processing style preferences...",
      "Matching with Nigerian fashion trends...",
      "Finding suitable tailors...",
      "Calculating compatibility scores...",
      "Finalizing recommendations..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(stages[i]);
      
      // Simulate AI processing time
      for (let progress = 0; progress <= 100; progress += 10) {
        setAnalysisProgress((i / stages.length) * 100 + (progress / stages.length));
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }

    // Generate mock recommendations based on user profile
    const mockRecommendations: RecommendedDesign[] = [
      {
        id: 1,
        name: "Premium Agbada Collection",
        image: "https://images.unsplash.com/photo-1594736797933-d0301ba4fa59?w=400&h=500&fit=crop",
        price: "₦85,000",
        category: "Agbada",
        matchScore: 96,
        reasonsForRecommendation: [
          "Perfect for formal occasions in your profile",
          "Complements your body measurements",
          "Matches your sophisticated style preference",
          "Traditional Nigerian elegance"
        ],
        tailorName: "Adebayo Tailoring",
        tailorRating: "4.8",
        estimatedDelivery: "2-3 weeks"
      },
      {
        id: 2,
        name: "Contemporary Ankara Suit",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        price: "₦45,000",
        category: "Ankara",
        matchScore: 89,
        reasonsForRecommendation: [
          "Trending contemporary design",
          "Fits your budget range",
          "Versatile for multiple occasions",
          "Modern interpretation of traditional wear"
        ],
        tailorName: "Fatima's Fashion House",
        tailorRating: "4.9",
        estimatedDelivery: "1-2 weeks"
      },
      {
        id: 3,
        name: "Dashiki Dress Premium",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
        price: "₦32,000",
        category: "Dashiki",
        matchScore: 85,
        reasonsForRecommendation: [
          "Aligns with your color preferences",
          "Comfortable for casual occasions",
          "Authentic Nigerian craftsmanship",
          "Great value for money"
        ],
        tailorName: "Kano Kaftan Masters",
        tailorRating: "4.7",
        estimatedDelivery: "1 week"
      }
    ];

    setRecommendations(mockRecommendations);
    setCurrentTrends([
      "Bold geometric patterns",
      "Earth tone combinations",
      "Contemporary cuts with traditional motifs",
      "Sustainable fabric choices",
      "Minimalist embroidery"
    ]);
    setIsAnalyzing(false);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-orange-600 bg-orange-100";
    return "text-blue-600 bg-blue-100";
  };

  const refreshRecommendations = () => {
    generateRecommendations();
  };

  if (!userProfile || !measurements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Style Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
            <p className="text-gray-500 mb-4">
              Complete your measurements and style quiz to get personalized AI recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Status */}
      {isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 animate-pulse text-ofi-orange" />
              <span>AI Fashion Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>{analysisStage}</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-sm text-gray-500">
                Our AI is analyzing your style profile, body measurements, and current Nigerian fashion trends...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Style Profile Summary */}
      {!isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Your Style Profile</span>
              </div>
              <Button variant="outline" size="sm" onClick={refreshRecommendations}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Body Type</p>
                <p className="capitalize">{userProfile.bodyType}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Style</p>
                <p className="capitalize">{userProfile.stylePersonality}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Budget</p>
                <p>{userProfile.budgetRange}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Occasions</p>
                <p>{userProfile.occasions.slice(0, 2).join(", ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Trends */}
      {currentTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Current Nigerian Fashion Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentTrends.map((trend, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trend}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-ofi-orange" />
              <span>AI-Curated Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((design) => (
                <div key={design.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={design.image}
                      alt={design.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getMatchScoreColor(design.matchScore)} border-0`}>
                        {design.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {design.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">{design.name}</h3>
                      <p className="text-lg font-bold text-ofi-orange">{design.price}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Why this works for you:</h4>
                      <ul className="text-xs space-y-1">
                        {design.reasonsForRecommendation.slice(0, 3).map((reason, idx) => (
                          <li key={idx} className="flex items-start">
                            <Heart className="w-3 h-3 text-pink-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{design.tailorRating}</span>
                        <span>• {design.tailorName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{design.estimatedDelivery}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onRecommendationSelect(design)}
                      className="w-full bg-ofi-orange hover:bg-ofi-orange/90"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {!isAnalyzing && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Styling Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-ofi-orange">Personalization Factors</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Body measurements analysis</li>
                  <li>• Style preference matching</li>
                  <li>• Occasion-appropriate designs</li>
                  <li>• Color harmony analysis</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-ofi-orange">Cultural Authenticity</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Traditional Nigerian techniques</li>
                  <li>• Regional style variations</li>
                  <li>• Authentic fabric selections</li>
                  <li>• Cultural significance respect</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}