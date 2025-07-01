import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DesignWithTailor, Measurement } from "@shared/schema";

interface OrderSummaryProps {
  design: DesignWithTailor;
  measurements?: Measurement | null;
}

export default function OrderSummary({ design, measurements }: OrderSummaryProps) {
  const formatPrice = (price: string) => {
    return `₦${parseInt(price).toLocaleString()}`;
  };

  const designPrice = parseInt(design.price);
  const customizationFee = 5000;
  const deliveryFee = 2000;
  const totalAmount = designPrice + customizationFee + deliveryFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Design Details */}
        <div className="flex items-center space-x-4">
          <img
            src={design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100"}
            alt={design.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 capitalize">{design.name}</h4>
            <p className="text-sm text-gray-600">by {design.tailor.name}</p>
            <div className="flex items-center gap-2 mt-1">
              {design.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Design Price</span>
            <span className="font-medium">{formatPrice(design.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customization Fee</span>
            <span className="font-medium">{formatPrice(customizationFee.toString())}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">{formatPrice(deliveryFee.toString())}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-ofi-orange">{formatPrice(totalAmount.toString())}</span>
          </div>
        </div>

        <Separator />

        {/* Tailor Info */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Tailor Information</h4>
          <div className="flex items-center space-x-3">
            <img
              src={design.tailor.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"}
              alt={design.tailor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{design.tailor.name}</p>
              <div className="flex items-center text-sm text-gray-600">
                <span>⭐ {design.tailor.rating}</span>
                <span className="mx-2">•</span>
                <span>{design.tailor.totalReviews} reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Measurements */}
        {measurements && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Your Measurements</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chest:</span>
                  <span className="font-medium">{measurements.chest}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waist:</span>
                  <span className="font-medium">{measurements.waist}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hip:</span>
                  <span className="font-medium">{measurements.hip}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium">{measurements.height}"</span>
                </div>
                {measurements.shoulderWidth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shoulder:</span>
                    <span className="font-medium">{measurements.shoulderWidth}"</span>
                  </div>
                )}
                {measurements.armLength && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arm Length:</span>
                    <span className="font-medium">{measurements.armLength}"</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Delivery Timeline */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Estimated Timeline</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Tailor confirmation: 1-2 days</p>
            <p>• Production time: 7-14 days</p>
            <p>• Delivery: 2-3 days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
