import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Package, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import type { Tailor } from "@shared/schema";

interface TailorCardProps {
  tailor: Tailor;
}

export default function TailorCard({ tailor }: TailorCardProps) {
  const formatRevenue = (revenue: string) => {
    const amount = parseInt(revenue);
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const renderStars = (rating: string) => {
    const ratingNumber = parseFloat(rating);
    const fullStars = Math.floor(ratingNumber);
    const hasHalfStar = ratingNumber % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? "text-yellow-400 fill-current"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleWhatsAppContact = () => {
    const message = `Hi ${tailor.name}, I found your profile on Ofi and I'm interested in your designs. Can we discuss?`;
    const whatsappUrl = `https://wa.me/${tailor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <img
          src={tailor.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
          alt={tailor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {tailor.isVerified && (
            <Badge className="bg-green-500 text-white">
              ✓ Verified
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {tailor.totalOrders} orders completed
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{tailor.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(tailor.rating)}
            <span className="text-sm text-gray-600">
              {tailor.rating} ({tailor.totalReviews} reviews)
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{tailor.address}</span>
          </div>
        </div>

        {tailor.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tailor.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{tailor.totalOrders}</div>
            <div className="text-xs text-gray-600">Orders</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{formatRevenue(tailor.revenue)}</div>
            <div className="text-xs text-gray-600">Revenue</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/tailors/${tailor.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Package className="h-4 w-4 mr-2" />
              View Designs
            </Button>
          </Link>
          <Button 
            onClick={handleWhatsAppContact}
            className="bg-ofi-green hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
