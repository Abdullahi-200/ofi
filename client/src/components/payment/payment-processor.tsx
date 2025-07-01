
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import PaystackPayment from "./paystack-payment";
import { MonetizationService } from "@/services/monetization";

interface PaymentProcessorProps {
  orderTotal: number;
  currency?: string;
  userEmail: string;
  metadata?: any;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
}

export default function PaymentProcessor({ 
  orderTotal, 
  currency = "NGN",
  userEmail,
  metadata,
  onPaymentSuccess,
  onPaymentError 
}: PaymentProcessorProps) {
  const [paymentComplete, setPaymentComplete] = useState(false);

  const commission = MonetizationService.calculateOrderCommission(orderTotal);
  const totalAmount = orderTotal + Math.round(orderTotal * 0.015); // Add Paystack fee

  const handlePaymentSuccess = (reference: string, transactionData: any) => {
    setPaymentComplete(true);
    onPaymentSuccess({
      reference,
      transactionData,
      commission,
      totalAmount
    });
  };

  const handlePaymentError = (error: any) => {
    onPaymentError(error);
  };

  if (paymentComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">Payment Confirmed</h3>
            <p className="text-gray-500 mb-4">
              Your order has been successfully placed and payment processed via Paystack.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span>Order Amount:</span>
                <span>{MonetizationService.formatNGN(orderTotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Platform Commission:</span>
                <span>{MonetizationService.formatNGN(commission.commissionAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Total Paid:</span>
                <span className="font-semibold">{MonetizationService.formatNGN(totalAmount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Commission Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Order Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Order Amount</span>
              <span className="font-semibold">{MonetizationService.formatNGN(orderTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Platform Commission (5%)</span>
              <span>{MonetizationService.formatNGN(commission.commissionAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tailor Earnings</span>
              <span className="text-green-600">{MonetizationService.formatNGN(commission.tailorEarnings)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>You Pay</span>
              <span className="text-ofi-orange">{MonetizationService.formatNGN(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paystack Payment */}
      <PaystackPayment
        amount={totalAmount}
        email={userEmail}
        metadata={metadata}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
