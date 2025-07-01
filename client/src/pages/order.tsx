import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageCircle, Package, Truck } from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import OrderSummary from "@/components/order/order-summary";
import type { DesignWithTailor, Measurement } from "@shared/schema";

const orderFormSchema = z.object({
  deliveryAddress: z.string().min(10, "Please provide a complete delivery address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  preferredDeliveryDate: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export default function Order() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: design, isLoading: designLoading } = useQuery<DesignWithTailor>({
    queryKey: [`/api/designs/${id}`],
  });

  const { data: userMeasurements } = useQuery<Measurement>({
    queryKey: [`/api/measurements/user/1`], // Mock user ID
    retry: false,
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      deliveryAddress: "",
      phone: "",
      preferredDeliveryDate: "",
      specialInstructions: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: async (response) => {
      const order = await response.json();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been sent to the tailor. You'll receive updates via WhatsApp.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setLocation(`/profile`);
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    if (!design || !userMeasurements) {
      toast({
        title: "Missing Information",
        description: "Please complete your measurements before placing an order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      userId: 1, // Mock user ID
      tailorId: design.tailorId,
      designId: design.id,
      measurements: {
        chest: userMeasurements.chest,
        waist: userMeasurements.waist,
        hip: userMeasurements.hip,
        shoulderWidth: userMeasurements.shoulderWidth,
        armLength: userMeasurements.armLength,
        height: userMeasurements.height,
      },
      deliveryAddress: data.deliveryAddress,
      phone: data.phone,
      preferredDeliveryDate: data.preferredDeliveryDate ? new Date(data.preferredDeliveryDate) : null,
      specialInstructions: data.specialInstructions,
      designPrice: design.price,
      customizationFee: "5000",
      deliveryFee: "2000",
      totalAmount: (parseInt(design.price) + 5000 + 2000).toString(),
    };

    createOrderMutation.mutate(orderData);
    setIsSubmitting(false);
  };

  const handleWhatsAppContact = () => {
    if (design) {
      const message = `Hi ${design.tailor.name}, I'm interested in ordering your ${design.name} design. Can we discuss the details?`;
      const whatsappUrl = `https://wa.me/${design.tailor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (designLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/design/${design.id}`}>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Design
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Place Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Review your selection and connect with your chosen tailor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <OrderSummary 
              design={design}
              measurements={userMeasurements}
            />
          </div>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your complete delivery address"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+234 xxx xxx xxxx"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredDeliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Delivery Date (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests for the tailor..."
                            {...field}
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-6">
                    <Button
                      type="button"
                      onClick={handleWhatsAppContact}
                      className="w-full bg-ofi-green hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Tailor on WhatsApp
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting || createOrderMutation.isPending}
                      className="w-full bg-ofi-orange hover:bg-orange-600"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Package className="mr-2 h-4 w-4" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Missing Measurements Warning */}
        {!userMeasurements && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-orange-900">Measurements Required</h3>
                  <p className="text-orange-700 text-sm mt-1">
                    You need to complete your body measurements before placing an order.
                  </p>
                </div>
                <Link href="/measurement">
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Take Measurements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
