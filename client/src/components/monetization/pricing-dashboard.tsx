
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package,
  Crown,
  Palette,
  Calculator,
  Star,
  Check
} from "lucide-react";
import { MonetizationService, PaymentService } from "@/services/monetization";
import PaystackPayment from "@/components/payment/paystack-payment";

interface PricingDashboardProps {
  userType: 'customer' | 'tailor' | 'admin';
  userId?: number;
}

export default function PricingDashboard({ userType, userId }: PricingDashboardProps) {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'subscription' | 'template'>('subscription');

  const subscriptionTiers = MonetizationService.getTailorSubscriptionTiers();
  const designTemplates = MonetizationService.getDesignTemplates();
  const revenueProjections = MonetizationService.calculateRevenueProjections(1000, 200);

  const handleSubscriptionUpgrade = (tierId: string) => {
    setSelectedTier(tierId);
    setPaymentType('subscription');
    setShowPayment(true);
  };

  const handleTemplatepurchase = (templateId: string) => {
    setSelectedTier(templateId);
    setPaymentType('template');
    setShowPayment(true);
  };

  const handlePaymentSuccess = (reference: string, transactionData: any) => {
    console.log('Payment successful:', reference, transactionData);
    setShowPayment(false);
    // Handle successful payment (update user subscription, grant access to template, etc.)
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setShowPayment(false);
  };

  const getPaymentAmount = () => {
    if (paymentType === 'subscription') {
      const tier = subscriptionTiers.find(t => t.id === selectedTier);
      return tier?.price || 0;
    } else {
      const template = designTemplates.find(t => t.id === selectedTier);
      return template?.price || 0;
    }
  };

  if (showPayment) {
    return (
      <div className="max-w-2xl mx-auto">
        <PaystackPayment
          amount={getPaymentAmount()}
          email={`user${userId}@ofi.com`} // In real app, get from user data
          metadata={{
            user_id: userId,
            payment_type: paymentType,
            tier_or_template: selectedTier
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onClose={() => setShowPayment(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview (Admin only) */}
      {userType === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Platform Revenue Projections</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-xl font-bold text-blue-900">
                  {MonetizationService.formatNGN(revenueProjections.orderCommissions)}
                </div>
                <div className="text-sm text-gray-600">Order Commissions</div>
                <div className="text-xs text-gray-500">
                  {MonetizationService.formatUSD(revenueProjections.orderCommissions)}
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Crown className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-xl font-bold text-green-900">
                  {MonetizationService.formatNGN(revenueProjections.subscriptions)}
                </div>
                <div className="text-sm text-gray-600">Subscriptions</div>
                <div className="text-xs text-gray-500">
                  {MonetizationService.formatUSD(revenueProjections.subscriptions)}
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Palette className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-xl font-bold text-purple-900">
                  {MonetizationService.formatNGN(revenueProjections.templates)}
                </div>
                <div className="text-sm text-gray-600">Design Templates</div>
                <div className="text-xs text-gray-500">
                  {MonetizationService.formatUSD(revenueProjections.templates)}
                </div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-xl font-bold text-orange-900">
                  {MonetizationService.formatNGN(revenueProjections.total)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-xs text-gray-500">
                  {MonetizationService.formatUSD(revenueProjections.total)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="templates">Design Templates</TabsTrigger>
          <TabsTrigger value="commission">Commission Info</TabsTrigger>
        </TabsList>

        {/* Tailor Subscriptions */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionTiers.map((tier) => (
              <Card key={tier.id} className={`relative ${tier.isPopular ? 'border-ofi-orange' : ''}`}>
                {tier.isPopular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-ofi-orange">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tier.name}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ofi-orange">
                        {MonetizationService.formatNGN(tier.price)}
                      </div>
                      {tier.price > 0 && (
                        <div className="text-sm text-gray-500">per month</div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {userType === 'tailor' && tier.price > 0 && (
                    <Button 
                      onClick={() => handleSubscriptionUpgrade(tier.id)}
                      className="w-full bg-ofi-orange hover:bg-ofi-orange/90"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to {tier.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Design Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designTemplates.map((template) => (
              <Card key={template.id}>
                <div className="relative">
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {template.aiGenerated && (
                    <Badge className="absolute top-2 right-2 bg-purple-600">
                      AI Generated
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{template.name}</span>
                    <div className="text-xl font-bold text-ofi-orange">
                      {MonetizationService.formatNGN(template.price)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button 
                      onClick={() => handleTemplatepurchase(template.id)}
                      size="sm"
                      className="bg-ofi-orange hover:bg-ofi-orange/90"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Purchase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Commission Information */}
        <TabsContent value="commission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Commission Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">5%</div>
                    <div className="text-sm text-gray-600">Platform Commission</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-gray-600">Tailor Earnings</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {MonetizationService.formatNGN(MonetizationService.AVERAGE_ORDER_VALUE)}
                    </div>
                    <div className="text-sm text-gray-600">Average Order</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example Calculation:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order Amount:</span>
                      <span>{MonetizationService.formatNGN(10000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Commission (5%):</span>
                      <span className="text-red-600">-{MonetizationService.formatNGN(500)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Tailor Earnings:</span>
                      <span className="text-green-600">{MonetizationService.formatNGN(9500)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
