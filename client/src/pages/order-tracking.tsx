import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  MessageCircle,
  Star
} from "lucide-react";
import { Link } from "wouter";
import { realTimeService } from "@/services/realtime";
import { useToast } from "@/hooks/use-toast";

interface OrderStatus {
  status: string;
  timestamp: Date;
  description: string;
  completed: boolean;
}

interface OrderTracking {
  id: number;
  orderNumber: string;
  status: string;
  progress: number;
  estimatedDelivery: Date;
  statusHistory: OrderStatus[];
  tailor: {
    id: number;
    name: string;
    profileImage?: string;
    phone: string;
    rating: string;
  };
  design: {
    id: number;
    name: string;
    images: string[];
  };
  measurements: Record<string, string>;
  customizations: Record<string, any>;
  totalAmount: string;
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (orderId) {
      realTimeService.connect();
      realTimeService.joinOrderRoom(parseInt(orderId));

      // Listen for order status updates
      const handleStatusUpdate = (data: any) => {
        if (data.orderId === parseInt(orderId)) {
          toast({
            title: "Order Status Updated",
            description: `Your order is now ${data.status}`,
          });
          queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}`] });
        }
      };

      realTimeService.on('order-status-changed', handleStatusUpdate);

      return () => {
        realTimeService.off('order-status-changed', handleStatusUpdate);
      };
    }
  }, [orderId, queryClient, toast]);

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const statusSteps = [
    { key: "pending", label: "Order Confirmed", icon: CheckCircle },
    { key: "measurements_verified", label: "Measurements Verified", icon: Package },
    { key: "in_production", label: "In Production", icon: Scissors },
    { key: "quality_check", label: "Quality Check", icon: Clock },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const getStatusProgress = (status: string) => {
    const statusIndex = statusSteps.findIndex(step => step.key === status);
    return ((statusIndex + 1) / statusSteps.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "yellow";
      case "measurements_verified": return "blue";
      case "in_production": return "purple";
      case "quality_check": return "orange";
      case "shipped": return "indigo";
      case "delivered": return "green";
      default: return "gray";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const initiateWhatsAppChat = (phone: string, orderNumber: string) => {
    const message = encodeURIComponent(
      `Hi! I'm reaching out regarding my order ${orderNumber}. I'd like to get an update on the progress.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-gray-500 mb-4">We couldn't find the order you're looking for.</p>
            <Link href="/profile">
              <Button>View All Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typedOrder = order as OrderTracking;
  const currentProgress = getStatusProgress(typedOrder.status);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{typedOrder.orderNumber}</h1>
          <p className="text-gray-500">Track your custom clothing order</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {typedOrder.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(currentProgress)}% Complete</span>
            </div>
            <Progress value={currentProgress} className="h-2" />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
              {statusSteps.map((step, index) => {
                const isCompleted = statusSteps.findIndex(s => s.key === typedOrder.status) >= index;
                const isCurrent = step.key === typedOrder.status;
                const Icon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center text-center space-y-2 ${
                      isCompleted ? 'text-ofi-orange' : 'text-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      isCompleted ? 'bg-ofi-orange text-white' :
                      isCurrent ? 'bg-ofi-orange/20 text-ofi-orange' :
                      'bg-gray-100'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={typedOrder.design.images[0]}
                alt={typedOrder.design.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{typedOrder.design.name}</h3>
                <p className="text-sm text-gray-500">Total: {typedOrder.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  Expected Delivery: {formatDate(typedOrder.estimatedDelivery)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Measurements</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(typedOrder.measurements).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(typedOrder.customizations).length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Customizations</h4>
                <div className="text-sm space-y-1">
                  {Object.entries(typedOrder.customizations).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace('_', ' ')}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tailor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tailor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={typedOrder.tailor.profileImage} />
                <AvatarFallback>{typedOrder.tailor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{typedOrder.tailor.name}</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span>{typedOrder.tailor.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => initiateWhatsAppChat(typedOrder.tailor.phone, typedOrder.orderNumber)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Chat
              </Button>

              <Link href={`/chat/${typedOrder.tailor.id}`}>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Direct Message
                </Button>
              </Link>

              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Tailor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typedOrder.statusHistory.map((status, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  status.completed ? 'bg-ofi-orange' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">
                      {status.status.replace('_', ' ')}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(status.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{status.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}