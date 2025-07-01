import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import type { DesignWithTailor } from "@shared/schema";

interface DesignCardProps {
  design: DesignWithTailor;
}

export default function DesignCard({ design }: DesignCardProps) {
  const formatPrice = (price: string) => {
    return `₦${parseInt(price).toLocaleString()}`;
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

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <img
          src={design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"}
          alt={design.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {design.isTrending && (
            <Badge className="bg-ofi-gold text-gray-900">
              Trending
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full h-8 w-8"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={design.tailor.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
            alt={design.tailor.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{design.tailor.name}</h3>
            <div className="flex items-center gap-2">
              {renderStars(design.tailor.rating)}
              <span className="text-sm text-gray-600">
                {design.tailor.rating} ({design.tailor.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2 capitalize">{design.name}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{design.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {design.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-ofi-orange">
            {formatPrice(design.price)}
          </span>
          <Link href={`/design/${design.id}`}>
            <Button className="bg-ofi-orange hover:bg-orange-600">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
