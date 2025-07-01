
// Monetization service for Ofi platform

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  isPopular?: boolean;
}

export interface OrderCommission {
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  tailorEarnings: number;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  price: number;
  previewImage: string;
  description: string;
  aiGenerated: boolean;
}

export class MonetizationService {
  // Commission rates
  static readonly ORDER_COMMISSION_RATE = 0.05; // 5%
  static readonly AVERAGE_ORDER_VALUE = 10000; // ₦10,000
  
  // Subscription pricing
  static readonly TAILOR_PREMIUM_MONTHLY = 5000; // ₦5,000
  
  // Design template pricing
  static readonly DESIGN_TEMPLATE_PRICE = 2000; // ₦2,000

  // Calculate order commission
  static calculateOrderCommission(orderAmount: number): OrderCommission {
    const commissionAmount = Math.round(orderAmount * this.ORDER_COMMISSION_RATE);
    const tailorEarnings = orderAmount - commissionAmount;
    
    return {
      baseAmount: orderAmount,
      commissionRate: this.ORDER_COMMISSION_RATE,
      commissionAmount,
      tailorEarnings
    };
  }

  // Get tailor subscription tiers
  static getTailorSubscriptionTiers(): PricingTier[] {
    return [
      {
        id: 'basic',
        name: 'Basic',
        price: 0,
        currency: 'NGN',
        features: [
          'Basic profile listing',
          'Up to 5 design uploads',
          'Standard customer support',
          'Basic analytics'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: this.TAILOR_PREMIUM_MONTHLY,
        currency: 'NGN',
        features: [
          'Priority listing placement',
          'Unlimited design uploads',
          'Advanced analytics dashboard',
          'Priority customer support',
          'Featured tailor badge',
          'Custom branding options',
          'Bulk order management',
          'Marketing campaign tools'
        ],
        isPopular: true
      }
    ];
  }

  // Get design templates
  static getDesignTemplates(): DesignTemplate[] {
    return [
      {
        id: 'agbada_classic',
        name: 'Classic Agbada Template',
        category: 'agbada',
        price: this.DESIGN_TEMPLATE_PRICE,
        previewImage: 'https://images.unsplash.com/photo-1594736797933-d0301ba4fa59?w=400',
        description: 'AI-generated classic Agbada design with traditional embroidery patterns',
        aiGenerated: true
      },
      {
        id: 'ankara_modern',
        name: 'Modern Ankara Design',
        category: 'ankara',
        price: this.DESIGN_TEMPLATE_PRICE,
        previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: 'Contemporary Ankara patterns optimized for modern fits',
        aiGenerated: true
      },
      {
        id: 'dashiki_casual',
        name: 'Casual Dashiki Collection',
        category: 'dashiki',
        price: this.DESIGN_TEMPLATE_PRICE,
        previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
        description: 'Relaxed-fit Dashiki designs with vibrant color combinations',
        aiGenerated: true
      },
      {
        id: 'kaftan_elegant',
        name: 'Elegant Kaftan Series',
        category: 'kaftan',
        price: this.DESIGN_TEMPLATE_PRICE,
        previewImage: 'https://images.unsplash.com/photo-1594736797933-d0301ba4fa59?w=400',
        description: 'Sophisticated Kaftan designs for formal occasions',
        aiGenerated: true
      }
    ];
  }

  // Calculate platform revenue projections
  static calculateRevenueProjections(monthlyOrders: number, tailorSubscriptions: number) {
    const orderCommissionRevenue = monthlyOrders * this.AVERAGE_ORDER_VALUE * this.ORDER_COMMISSION_RATE;
    const subscriptionRevenue = tailorSubscriptions * this.TAILOR_PREMIUM_MONTHLY;
    const templateRevenue = monthlyOrders * 0.3 * this.DESIGN_TEMPLATE_PRICE; // Assuming 30% of orders buy templates
    
    return {
      orderCommissions: orderCommissionRevenue,
      subscriptions: subscriptionRevenue,
      templates: templateRevenue,
      total: orderCommissionRevenue + subscriptionRevenue + templateRevenue
    };
  }

  // Format Nigerian currency
  static formatNGN(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Format USD equivalent
  static formatUSD(ngnAmount: number, exchangeRate: number = 1600): string {
    const usdAmount = ngnAmount / exchangeRate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(usdAmount);
  }
}

// Payment integration helper
export class PaymentService {
  static async processPaystackPayment(
    amount: number,
    email: string,
    metadata: any = {}
  ): Promise<{ success: boolean; reference?: string; error?: string }> {
    try {
      // Initialize Paystack payment
      const reference = `ofi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // This would integrate with your backend to create a payment
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to kobo
          email,
          reference,
          metadata
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, reference: data.reference };
      } else {
        throw new Error('Payment initialization failed');
      }
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment failed' 
      };
    }
  }

  static async verifyPayment(reference: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`/api/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        throw new Error('Payment verification failed');
      }
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      };
    }
  }
}
