
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Shield, 
  CheckCircle,
  Clock,
  DollarSign,
  Lock,
  Building,
  Smartphone,
  Globe
} from "lucide-react";

interface PaystackPaymentProps {
  amount: number;
  email: string;
  currency?: string;
  metadata?: any;
  onSuccess: (reference: string, transactionData: any) => void;
  onError: (error: any) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackPayment({ 
  amount, 
  email, 
  currency = "NGN",
  metadata,
  onSuccess,
  onError,
  onClose
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, available: true },
    { id: 'bank', name: 'Bank Transfer', icon: Building, available: true },
    { id: 'ussd', name: 'USSD', icon: Smartphone, available: true },
    { id: 'mobile_money', name: 'Mobile Money', icon: Smartphone, available: true },
  ]);
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Load Paystack script
  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateCommission = (baseAmount: number) => {
    return Math.round(baseAmount * 0.05); // 5% commission
  };

  const paystackFee = Math.round(amount * 0.015); // 1.5% Paystack fee
  const platformCommission = calculateCommission(amount);
  const totalAmount = amount + paystackFee;

  const initializePayment = () => {
    if (!window.PaystackPop) {
      onError({ message: 'Paystack SDK not loaded' });
      return;
    }

    setIsLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key', // Replace with your Paystack public key
      email: email,
      amount: totalAmount * 100, // Paystack expects amount in kobo
      currency: currency,
      ref: `ofi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Platform Commission",
            variable_name: "platform_commission",
            value: platformCommission
          },
          {
            display_name: "Payment Method",
            variable_name: "payment_method", 
            value: selectedMethod
          }
        ],
        ...metadata
      },
      callback: function(response: any) {
        setIsLoading(false);
        // Verify payment on server
        verifyPayment(response.reference, response);
      },
      onClose: function() {
        setIsLoading(false);
        onClose && onClose();
      }
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference: string, transactionData: any) => {
    try {
      // In a real implementation, verify payment on your server
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference, transactionData })
      });

      if (response.ok) {
        const verificationResult = await response.json();
        onSuccess(reference, verificationResult);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Payment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Order Amount</span>
              <span className="font-semibold">{formatAmount(amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Platform Commission (5%)</span>
              <span>{formatAmount(platformCommission)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Payment Processing Fee</span>
              <span>{formatAmount(paystackFee)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-ofi-orange">{formatAmount(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => method.available && setSelectedMethod(method.id)}
                  disabled={!method.available}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedMethod === method.id
                      ? "border-ofi-orange bg-orange-50"
                      : method.available
                      ? "border-gray-200 hover:border-gray-300"
                      : "border-gray-100 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6" />
                    <span className="font-medium">{method.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Paystack Payment Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={initializePayment}
            className="w-full bg-ofi-orange hover:bg-ofi-orange/90 h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Clock className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Shield className="w-5 h-5 mr-2" />
            )}
            Pay {formatAmount(totalAmount)} with Paystack
          </Button>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Lock className="w-4 h-4 mr-2" />
            <span>Secured by Paystack - Nigeria's leading payment processor</span>
          </div>
        </CardContent>
      </Card>

      {/* Paystack Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Why Paystack?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium">Trusted by 200k+ businesses</h4>
              <p className="text-gray-600">Secure payments</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Globe className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium">Multiple Payment Options</h4>
              <p className="text-gray-600">Cards, Bank, USSD, Mobile Money</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Lock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium">Bank-Grade Security</h4>
              <p className="text-gray-600">PCI DSS Level 1 compliant</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
