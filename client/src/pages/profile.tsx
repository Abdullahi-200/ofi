import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Package, Ruler, Heart, Settings, Clock, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import type { OrderWithDetails, Measurement, User as UserType } from "@shared/schema";

// Mock user data - in a real app this would come from authentication
const mockUser: UserType = {
  id: 1,
  name: "Amina Kemi",
  email: "amina.kemi@example.com",
  phone: "+234 803 555 0100",
  address: "123 Fashion Street, Victoria Island, Lagos, Nigeria",
  createdAt: new Date("2024-01-15"),
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");

  const { data: orders, isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: [`/api/orders/user/1`], // Mock user ID
  });

  const { data: measurements } = useQuery<Measurement>({
    queryKey: [`/api/measurements/user/1`], // Mock user ID
  });

  const formatPrice = (price: string) => {
    return `₦${parseInt(price).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b407?w=100" />
                <AvatarFallback className="text-2xl bg-ofi-orange text-white">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockUser.name}</h1>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{mockUser.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{mockUser.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{mockUser.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                {!measurements && (
                  <Link href="/measurement">
                    <Button className="bg-ofi-orange hover:bg-orange-600">
                      <Ruler className="h-4 w-4 mr-2" />
                      Take Measurements
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 text-ofi-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{orders?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {orders?.filter(o => o.status === "in_progress").length || 0}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Ruler className="h-8 w-8 text-ofi-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {measurements ? "✓" : "✗"}
              </div>
              <div className="text-sm text-gray-600">Measurements</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={order.design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80"}
                              alt={order.design.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 capitalize">{order.design.name}</h4>
                              <p className="text-sm text-gray-600">by {order.tailor.name}</p>
                              <p className="text-sm text-gray-500">
                                Ordered on {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatPrice(order.totalAmount)}
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start browsing designs to place your first order</p>
                    <Link href="/marketplace">
                      <Button className="bg-ofi-orange hover:bg-orange-600">
                        Browse Designs
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Measurements Tab */}
          <TabsContent value="measurements">
            <Card>
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                {measurements ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Primary Measurements</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Chest</span>
                            <span className="font-medium">{measurements.chest} {measurements.units}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Waist</span>
                            <span className="font-medium">{measurements.waist} {measurements.units}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Hip</span>
                            <span className="font-medium">{measurements.hip} {measurements.units}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Additional Measurements</h4>
                        <div className="space-y-3">
                          {measurements.shoulderWidth && (
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-gray-600">Shoulder Width</span>
                              <span className="font-medium">{measurements.shoulderWidth} {measurements.units}</span>
                            </div>
                          )}
                          {measurements.armLength && (
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-gray-600">Arm Length</span>
                              <span className="font-medium">{measurements.armLength} {measurements.units}</span>
                            </div>
                          )}
                          {measurements.height && (
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-gray-600">Height</span>
                              <span className="font-medium">{measurements.height} {measurements.units}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Link href="/measurement">
                        <Button variant="outline">
                          Update Measurements
                        </Button>
                      </Link>
                      <Button className="bg-ofi-orange hover:bg-orange-600">
                        View 3D Model
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No measurements yet</h3>
                    <p className="text-gray-600 mb-4">Take your measurements to get accurate fitting recommendations</p>
                    <Link href="/measurement">
                      <Button className="bg-ofi-orange hover:bg-orange-600">
                        <Ruler className="h-4 w-4 mr-2" />
                        Take Measurements
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Designs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-4">Start favoriting designs you love</p>
                  <Link href="/marketplace">
                    <Button className="bg-ofi-orange hover:bg-orange-600">
                      Browse Designs
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
