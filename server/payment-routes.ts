
import type { Express } from "express";
import crypto from "crypto";

interface PaystackPaymentRequest {
  amount: number;
  email: string;
  reference: string;
  metadata: any;
}

export function registerPaymentRoutes(app: Express) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_secret_key';
  const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key';

  // Initialize payment
  app.post("/api/payments/initialize", async (req, res) => {
    try {
      const { amount, email, reference, metadata }: PaystackPaymentRequest = req.body;

      const paymentData = {
        email,
        amount: amount, // Amount in kobo
        reference,
        metadata,
        callback_url: `${req.protocol}://${req.get('host')}/api/payments/callback`,
        channels: ['card', 'bank', 'ussd', 'mobile_money']
      };

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.status) {
        res.json({
          success: true,
          reference: data.data.reference,
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code
        });
      } else {
        res.status(400).json({
          success: false,
          message: data.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Payment initialization failed",
        error: error instanceof Error ? error.message : error
      });
    }
  });

  // Verify payment
  app.get("/api/payments/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;

      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.status && data.data.status === 'success') {
        // Process successful payment
        const paymentData = {
          reference: data.data.reference,
          amount: data.data.amount / 100, // Convert from kobo to naira
          currency: data.data.currency,
          status: data.data.status,
          customer: data.data.customer,
          metadata: data.data.metadata,
          paid_at: data.data.paid_at
        };

        // Calculate commission
        const orderAmount = paymentData.amount;
        const commission = Math.round(orderAmount * 0.05); // 5% commission
        const tailorEarnings = orderAmount - commission;

        // Store payment record (integrate with your database)
        // await storage.createPayment(paymentData);

        res.json({
          success: true,
          data: paymentData,
          commission: {
            amount: commission,
            tailorEarnings: tailorEarnings
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: data.message || 'Payment verification failed'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: error instanceof Error ? error.message : error
      });
    }
  });

  // Webhook for Paystack events
  app.post("/api/payments/webhook", (req, res) => {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    
    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;
      
      switch (event.event) {
        case 'charge.success':
          // Handle successful charge
          console.log('Payment successful:', event.data);
          break;
        case 'charge.failed':
          // Handle failed charge
          console.log('Payment failed:', event.data);
          break;
        case 'subscription.create':
          // Handle subscription creation
          console.log('Subscription created:', event.data);
          break;
        default:
          console.log('Unhandled event:', event.event);
      }
      
      res.status(200).send('OK');
    } else {
      res.status(400).send('Invalid signature');
    }
  });

  // Get payment history
  app.get("/api/payments/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // In a real implementation, fetch from database
      const mockPayments = [
        {
          id: 1,
          reference: `ofi_${Date.now()}_123`,
          amount: 15000,
          currency: 'NGN',
          status: 'success',
          type: 'order',
          created_at: new Date(),
          metadata: { order_id: 1 }
        }
      ];
      
      res.json(mockPayments);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch payment history",
        error: error instanceof Error ? error.message : error
      });
    }
  });

  // Calculate earnings for tailor
  app.get("/api/payments/earnings/:tailorId", async (req, res) => {
    try {
      const { tailorId } = req.params;
      
      // Mock earnings calculation
      const totalOrders = 150;
      const totalRevenue = 1500000; // ₦1.5M
      const commission = Math.round(totalRevenue * 0.05);
      const earnings = totalRevenue - commission;
      
      res.json({
        tailorId,
        totalOrders,
        totalRevenue,
        platformCommission: commission,
        earnings,
        currency: 'NGN'
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to calculate earnings",
        error: error instanceof Error ? error.message : error
      });
    }
  });
}
