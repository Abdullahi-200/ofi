import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart, 
  Upload, 
  Package, 
  DollarSign, 
  Star, 
  TrendingUp,
  Plus,
  Edit,
  Eye,
  MessageCircle
} from "lucide-react";
import { Link } from "wouter";
import type { TailorWithStats, OrderWithDetails } from "@shared/schema";

// Mock tailor data - in a real app this would come from authentication
const mockTailorId = 1;

export default function TailorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: tailorStats, isLoading: statsLoading } = useQuery<TailorWithStats>({
    queryKey: [`/api/tailors/${mockTailorId}`],
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: [`/api/orders/tailor/${mockTailorId}`],
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
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tailorStats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tailor Dashboard Not Available</h1>
            <p className="text-gray-600 mb-4">Please make sure you're logged in as a tailor.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="gradient-tailor rounded-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-6">Tailor Dashboard</h1>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{tailorStats.totalOrders}</div>
                    <div className="text-sm opacity-80">Total Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatPrice(tailorStats.revenue)}</div>
                    <div className="text-sm opacity-80">Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{tailorStats.rating}</div>
                    <div className="text-sm opacity-80">Rating</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Upload className="mr-3 h-5 w-5" />
                  <span>Easy design upload and management</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-3 h-5 w-5" />
                  <span>Real-time analytics and insights</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  <span>Direct customer communication</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-3 h-5 w-5" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>

            <div>
              <Card className="bg-white text-gray-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {recentOrders?.filter(o => o.status === "pending").length || 0} New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-ofi-orange rounded-lg flex items-center justify-center mr-3">
                              <Package className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{order.user.name}</div>
                              <div className="text-sm text-gray-600 capitalize">{order.design.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(order.totalAmount)}</div>
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No recent orders</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 text-ofi-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tailorStats.totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 text-ofi-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{formatPrice(tailorStats.revenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 text-ofi-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tailorStats.rating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tailorStats.designs.length}</div>
              <div className="text-sm text-gray-600">Active Designs</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-ofi-orange text-white">
                                {order.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{order.user.name}</div>
                              <div className="text-xs text-gray-600 capitalize">{order.design.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">{formatPrice(order.totalAmount)}</div>
                            <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No orders yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Top Designs */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Top Designs</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Design
                  </Button>
                </CardHeader>
                <CardContent>
                  {tailorStats.designs.length > 0 ? (
                    <div className="space-y-4">
                      {tailorStats.designs.slice(0, 5).map((design) => (
                        <div key={design.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img
                              src={design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=50"}
                              alt={design.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium text-sm capitalize">{design.name}</div>
                              <div className="text-xs text-gray-600">{formatPrice(design.price)}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-2">No designs yet</p>
                      <Button className="bg-ofi-orange hover:bg-orange-600" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Design
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={order.design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80"}
                              alt={order.design.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                              <p className="text-sm text-gray-600">Customer: {order.user.name}</p>
                              <p className="text-sm text-gray-600 capitalize">Design: {order.design.name}</p>
                              <p className="text-sm text-gray-500">
                                Ordered on {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 mb-2">
                              {formatPrice(order.totalAmount)}
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders will appear here when customers place them</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Designs Tab */}
          <TabsContent value="designs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Designs</CardTitle>
                <Button className="bg-ofi-orange hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Design
                </Button>
              </CardHeader>
              <CardContent>
                {tailorStats.designs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tailorStats.designs.map((design) => (
                      <div key={design.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                          src={design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300"}
                          alt={design.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1 capitalize">{design.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{design.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-ofi-orange">{formatPrice(design.price)}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs yet</h3>
                    <p className="text-gray-600 mb-4">Start showcasing your work by adding your first design</p>
                    <Button className="bg-ofi-orange hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Design
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Analytics charts will be available here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Customers</span>
                      <span className="font-semibold">{recentOrders?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Repeat Customers</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-semibold">
                        {recentOrders && recentOrders.length > 0 
                          ? formatPrice((recentOrders.reduce((sum, order) => sum + parseInt(order.totalAmount), 0) / recentOrders.length).toString())
                          : "₦0"
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
