import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Share2, MessageCircle, ArrowLeft } from "lucide-react";
import ModelViewer from "@/components/model/model-viewer";
import type { DesignWithTailor } from "@shared/schema";

export default function DesignDetails() {
  const { id } = useParams();
  
  const { data: design, isLoading } = useQuery<DesignWithTailor>({
    queryKey: [`/api/designs/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Design Not Found</h1>
            <Link href="/marketplace">
              <Button>Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return `₦${parseInt(price).toLocaleString()}`;
  };

  const renderStars = (rating: string) => {
    const ratingNumber = parseFloat(rating);
    const fullStars = Math.floor(ratingNumber);

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/marketplace">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"}
                alt={design.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              {design.isTrending && (
                <Badge className="absolute top-4 right-4 bg-ofi-gold text-gray-900">
                  Trending
                </Badge>
              )}
            </div>
            
            {/* Additional images */}
            {design.images && design.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {design.images.slice(1, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${design.name} view ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Design Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                {design.name}
              </h1>
              <p className="text-xl font-bold text-ofi-orange mb-4">
                {formatPrice(design.price)}
              </p>
              <p className="text-gray-600">{design.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {design.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Tailor Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Tailor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={design.tailor.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
                    alt={design.tailor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{design.tailor.name}</h3>
                    <div className="flex items-center gap-2">
                      {renderStars(design.tailor.rating)}
                      <span className="text-sm text-gray-600">
                        {design.tailor.rating} ({design.tailor.totalReviews} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {design.tailor.totalOrders} completed orders
                    </p>
                  </div>
                </div>
                {design.tailor.description && (
                  <p className="text-gray-600 text-sm">{design.tailor.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 hover:text-red-500"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="text-gray-600">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Tailor
                </Button>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button className="bg-ofi-green hover:bg-green-700 flex-1">
                  Try on 3D Model
                </Button>
                <Link href={`/order/${design.id}`}>
                  <Button className="bg-ofi-orange hover:bg-orange-600 flex-1">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sizing Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Sizing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  This design is custom-made based on your measurements. 
                  Complete our AI measurement process for the perfect fit.
                </p>
                <Link href="/measurement">
                  <Button variant="outline" className="w-full">
                    Take Measurements
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div className="mt-12">
          <ModelViewer designId={design.id} />
        </div>
      </div>
    </div>
  );
}
