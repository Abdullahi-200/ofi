
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Lock,
  QrCode,
  Building,
  Wallet
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "bank" | "mobile" | "crypto";
  icon: any;
  fees: string;
  processingTime: string;
  available: boolean;
}

interface PaymentProcessorProps {
  orderTotal: number;
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
}

export default function PaymentProcessor({ 
  orderTotal, 
  currency = "NGN",
  onPaymentSuccess,
  onPaymentError 
}: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      type: "card",
      icon: CreditCard,
      fees: "2.5%",
      processingTime: "Instant",
      available: true
    },
    {
      id: "paystack",
      name: "Paystack",
      type: "card",
      icon: CreditCard,
      fees: "1.5%",
      processingTime: "Instant",
      available: true
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      type: "mobile",
      icon: Smartphone,
      fees: "1.4%",
      processingTime: "Instant",
      available: true
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      type: "bank",
      icon: Building,
      fees: "₦50",
      processingTime: "1-3 hours",
      available: true
    },
    {
      id: "ussd",
      name: "USSD (*737#)",
      type: "mobile",
      icon: Smartphone,
      fees: "₦20",
      processingTime: "Instant",
      available: true
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      type: "mobile",
      icon: Wallet,
      fees: "0%",
      processingTime: "Instant",
      available: false
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateFees = (method: PaymentMethod): number => {
    if (method.fees.includes('%')) {
      const percentage = parseFloat(method.fees.replace('%', ''));
      return (orderTotal * percentage) / 100;
    } else {
      return parseFloat(method.fees.replace('₦', ''));
    }
  };

  const processPayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    const stages = [
      "Validating payment details...",
      "Connecting to payment gateway...",
      "Processing transaction...",
      "Verifying payment...",
      "Confirming order...",
      "Payment successful!"
    ];
    
    try {
      for (let i = 0; i < stages.length; i++) {
        setProcessingStage(stages[i]);
        
        for (let progress = 0; progress <= 100; progress += 20) {
          setProgress((i / stages.length) * 100 + (progress / stages.length));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Simulate potential payment failures
        if (i === 2 && Math.random() < 0.1) { // 10% chance of failure
          throw new Error("Payment declined by bank");
        }
      }
      
      const paymentData = {
        transactionId: `TXN_${Date.now()}`,
        method: selectedMethod,
        amount: orderTotal,
        fees: calculateFees(paymentMethods.find(m => m.id === selectedMethod)!),
        currency,
        timestamp: new Date(),
        status: "success"
      };
      
      setPaymentComplete(true);
      onPaymentSuccess(paymentData);
      
    } catch (error) {
      setIsProcessing(false);
      onPaymentError(error);
    }
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const fees = selectedPaymentMethod ? calculateFees(selectedPaymentMethod) : 0;
  const totalAmount = orderTotal + fees;

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
              Your order has been successfully placed and payment processed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span>Transaction ID:</span>
                <span className="font-mono">TXN_{Date.now()}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Amount Paid:</span>
                <span className="font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
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
              <span>Order Total</span>
              <span className="font-semibold">{formatCurrency(orderTotal)}</span>
            </div>
            {selectedPaymentMethod && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Processing Fee</span>
                <span>{formatCurrency(fees)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-ofi-orange">{formatCurrency(totalAmount)}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    {!method.available && (
                      <Badge variant="outline" className="text-xs">Soon</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Fee: {method.fees} • {method.processingTime}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      {selectedMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Card Details</span>
              <Lock className="w-4 h-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <Input
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <Input
                  placeholder="Full Name as on Card"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* USSD Instructions */}
      {selectedMethod === "ussd" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>USSD Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">How to pay with USSD:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Dial *737# from your registered phone number</li>
                  <li>Select "Transfer" option</li>
                  <li>Enter our account number: 1234567890</li>
                  <li>Enter amount: ₦{totalAmount.toLocaleString()}</li>
                  <li>Confirm transaction with your PIN</li>
                </ol>
              </div>
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Or scan this QR code with your banking app
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Processing Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>{processingStage}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500">
                Please do not close this window while payment is being processed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Button */}
      {selectedMethod && !isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={processPayment}
              className="w-full bg-ofi-orange hover:bg-ofi-orange/90 h-12 text-lg"
              disabled={!selectedMethod}
            >
              <Shield className="w-5 h-5 mr-2" />
              Pay {formatCurrency(totalAmount)} Securely
            </Button>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
              <Lock className="w-4 h-4 mr-2" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Payment Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Lock className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium">SSL Encrypted</h4>
              <p className="text-gray-600">Bank-level security</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium">PCI Compliant</h4>
              <p className="text-gray-600">Industry standards</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium">Verified Merchants</h4>
              <p className="text-gray-600">Trusted partners</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
