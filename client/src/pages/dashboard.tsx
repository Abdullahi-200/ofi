import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Package, 
  User, 
  Calendar,
  TrendingUp,
  MessageCircle,
  Scissors,
  Star,
  Clock,
  CheckCircle,
  Truck,
  Heart,
  Eye,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import StyleRecommendationEngine from "@/components/ai/style-recommendation-engine";

interface DashboardStats {
  totalOrders: number;
  completedMeasurements: boolean;
  completedStyleQuiz: boolean;
  activeChatThreads: number;
  favoriteDesigns: number;
  rewardPoints: number;
}

interface RecentActivity {
  id: string;
  type: "order_update" | "message" | "recommendation" | "measurement";
  title: string;
  description: string;
  timestamp: Date;
  actionUrl?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  completed?: boolean;
}

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Mock user ID - in real app, get from auth context
  const userId = 1;

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats", userId],
  });

  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["/api/dashboard/activity", userId, selectedTimeframe],
  });

  const { data: activeOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/dashboard/active-orders", userId],
  });

  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile", userId],
  });

  const { data: measurements } = useQuery({
    queryKey: ["/api/measurements/user", userId],
  });

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalOrders: 3,
    completedMeasurements: true,
    completedStyleQuiz: true,
    activeChatThreads: 2,
    favoriteDesigns: 8,
    rewardPoints: 150
  };

  const mockActivity: RecentActivity[] = [
    {
      id: "1",
      type: "order_update",
      title: "Order Update",
      description: "Your Agbada design is now in production",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionUrl: "/order-tracking/1"
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      description: "Adebayo Tailoring sent you a message",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      actionUrl: "/chat/1"
    },
    {
      id: "3",
      type: "recommendation",
      title: "New Recommendations",
      description: "AI found 3 new designs perfect for you",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      actionUrl: "/marketplace"
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: "measurements",
      title: "Take Measurements",
      description: "Get accurate AI-powered body measurements",
      icon: User,
      href: "/measurement",
      completed: mockStats.completedMeasurements
    },
    {
      id: "style-quiz",
      title: "Complete Style Quiz",
      description: "Help AI understand your style preferences",
      icon: Heart,
      href: "/style-quiz",
      completed: mockStats.completedStyleQuiz
    },
    {
      id: "browse-designs",
      title: "Browse Marketplace",
      description: "Discover custom Nigerian fashion designs",
      icon: Eye,
      href: "/marketplace"
    },
    {
      id: "chat-tailors",
      title: "Connect with Tailors",
      description: "Start conversations with verified artisans",
      icon: MessageCircle,
      href: "/chat"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order_update": return Package;
      case "message": return MessageCircle;
      case "recommendation": return TrendingUp;
      case "measurement": return User;
      default: return Clock;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const mockUserProfile = {
    bodyType: "athletic",
    colorPreferences: ["navy", "earth tones"],
    occasions: ["formal", "casual"],
    stylePersonality: "sophisticated",
    budgetRange: "₦30,000 - ₦80,000"
  };

  const mockMeasurements = {
    height: "175cm",
    chest: "98cm",
    waist: "82cm",
    hip: "95cm"
  };

  const handleRecommendationSelect = (design: any) => {
    // Navigate to design details
    window.location.href = `/design/${design.id}`;
  };

  const profileCompletionScore = () => {
    let score = 0;
    if (mockStats.completedMeasurements) score += 40;
    if (mockStats.completedStyleQuiz) score += 40;
    if (mockStats.totalOrders > 0) score += 20;
    return score;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-gray-500">Here's what's happening with your fashion journey</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Reward Points</p>
          <p className="text-2xl font-bold text-ofi-orange">{mockStats.rewardPoints}</p>
        </div>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Completion</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile Strength</span>
              <span className="text-sm text-gray-500">{profileCompletionScore()}%</span>
            </div>
            <Progress value={profileCompletionScore()} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.id} href={action.href}>
                    <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      action.completed 
                        ? "bg-green-50 border-green-200" 
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className={`w-4 h-4 ${action.completed ? "text-green-600" : "text-gray-600"}`} />
                        {action.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                      <h3 className="font-medium text-sm">{action.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Orders</span>
                </div>
                <span className="font-semibold">{mockStats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Active Chats</span>
                </div>
                <span className="font-semibold">{mockStats.activeChatThreads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Saved Designs</span>
                </div>
                <span className="font-semibold">{mockStats.favoriteDesigns}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Reward Points</span>
                </div>
                <span className="font-semibold text-ofi-orange">{mockStats.rewardPoints}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-ofi-orange/10 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-ofi-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                      {activity.actionUrl && (
                        <Link href={activity.actionUrl}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-2">
          <StyleRecommendationEngine
            userProfile={mockUserProfile}
            measurements={mockMeasurements}
            onRecommendationSelect={handleRecommendationSelect}
          />
        </div>
      </div>

      {/* Active Orders */}
      {mockStats.totalOrders > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Active Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: mockStats.totalOrders }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Order #{1000 + index + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      {index === 0 ? "In Production" : index === 1 ? "Shipped" : "Quality Check"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        index === 0 ? "1594736797933-d0301ba4fa59" : 
                        index === 1 ? "1507003211169-0a1dd7228f2d" : 
                        "1509631179647-0177331693ae"
                      }?w=100&h=100&fit=crop`}
                      alt="Design"
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {index === 0 ? "Premium Agbada" : index === 1 ? "Ankara Suit" : "Dashiki Dress"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Est. delivery: {index === 0 ? "2 weeks" : index === 1 ? "3 days" : "1 week"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/order-tracking/${index + 1}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        Track Order
                      </Button>
                    </Link>
                    <Link href={`/chat/${index + 1}`}>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}