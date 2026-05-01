import axios from 'axios';

const PAYMONGO_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.paymongo.com/v1' 
  : 'https://api.paymongo.com/v1';

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_PUBLIC_KEY = process.env.PAYMONGO_PUBLIC_KEY;

// Fee structure configuration
const FEE_STRUCTURE = {
  deposit: {
    gcash: { fee: 0.015, min_fee: 2, description: '1.5% + ₱2 minimum' },
    maya: { fee: 0.015, min_fee: 2, description: '1.5% + ₱2 minimum' },
    bank: { fee: 0.025, min_fee: 15, description: '2.5% + ₱15 minimum' },
    paymongo_checkout: { fee: 0.029, min_fee: 10, description: '2.9% + ₱10 minimum' }
  },
  withdrawal: {
    gcash: { fee: 0.015, min_fee: 15, description: '1.5% + ₱15 minimum' },
    maya: { fee: 0.015, min_fee: 15, description: '1.5% + ₱15 minimum' },
    bank: { fee: 0.025, min_fee: 30, description: '2.5% + ₱30 minimum' }
  }
};

// Create axios instance for PayMongo API
const paymongoAPI = axios.create({
  baseURL: PAYMONGO_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString('base64')}`
  }
});

// Calculate fees based on amount and payment method
export const calculateFees = (amount, paymentMethod, transactionType = 'deposit') => {
  const feeConfig = FEE_STRUCTURE[transactionType]?.[paymentMethod];
  
  if (!feeConfig) {
    return {
      fee: 0,
      netAmount: amount,
      totalAmount: amount,
      feeDescription: 'No fee information available'
    };
  }

  const calculatedFee = Math.max(amount * feeConfig.fee, feeConfig.min_fee);
  const netAmount = transactionType === 'deposit' ? amount - calculatedFee : amount - calculatedFee;
  const totalAmount = transactionType === 'deposit' ? amount : amount + calculatedFee;

  return {
    fee: calculatedFee,
    netAmount: Math.max(0, netAmount),
    totalAmount: totalAmount,
    feeDescription: feeConfig.description,
    breakdown: {
      percentage: amount * feeConfig.fee,
      minimum: feeConfig.min_fee,
      applied: calculatedFee
    }
  };
};

// Get fee information for display
export const getFeeInfo = (paymentMethod, transactionType = 'deposit') => {
  return FEE_STRUCTURE[transactionType]?.[paymentMethod] || null;
};

// Create a PayMongo checkout session
export const createCheckoutSession = async (amount, paymentMethods = [], customerInfo = {}) => {
  try {
    const payload = {
      data: {
        attributes: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'PHP',
          payment_method_types: paymentMethods,
          description: 'Deposit to WCEA Networking Account',
          statement_descriptor: 'WCEA DEPOSIT',
          send_email_receipt: false,
          billing: {
            name: customerInfo.name || '',
            email: customerInfo.email || '',
            phone: customerInfo.phone || ''
          },
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/u/deposit/success`,
          failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/u/deposit/failure`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/u/deposit`,
          metadata: {
            type: 'deposit',
            source: 'wcea_platform'
          }
        }
      }
    };

    const response = await paymongoAPI.post('/checkout', payload);
    return response.data;
  } catch (error) {
    console.error('PayMongo checkout session creation error:', error.response?.data || error.message);
    throw new Error('Failed to create checkout session');
  }
};

// Retrieve a checkout session
export const retrieveCheckoutSession = async (sessionId) => {
  try {
    const response = await paymongoAPI.get(`/checkout/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('PayMongo checkout session retrieval error:', error.response?.data || error.message);
    throw new Error('Failed to retrieve checkout session');
  }
};

// Create a payment intent (alternative to checkout)
export const createPaymentIntent = async (amount, paymentMethodId, customerInfo = {}) => {
  try {
    const payload = {
      data: {
        attributes: {
          amount: Math.round(amount * 100),
          currency: 'PHP',
          payment_method: paymentMethodId,
          description: 'Deposit to WCEA Networking Account',
          statement_descriptor: 'WCEA DEPOSIT',
          metadata: {
            type: 'deposit',
            source: 'wcea_platform'
          }
        }
      }
    };

    const response = await paymongoAPI.post('/payment_intents', payload);
    return response.data;
  } catch (error) {
    console.error('PayMongo payment intent creation error:', error.response?.data || error.message);
    throw new Error('Failed to create payment intent');
  }
};

// Get available payment methods
export const getAvailablePaymentMethods = () => {
  return [
    {
      id: 'gcash',
      name: 'GCash',
      description: 'Instant mobile wallet payment',
      icon: '📱',
      processingTime: 'Instant',
      available: true
    },
    {
      id: 'maya',
      name: 'PayMaya',
      description: 'Instant mobile wallet payment',
      icon: '📱',
      processingTime: 'Instant',
      available: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank deposit',
      icon: '🏦',
      processingTime: '1-3 business days',
      available: true
    },
    {
      id: 'paymongo_checkout',
      name: 'PayMongo Checkout',
      description: 'Secure online payment gateway',
      icon: '🔒',
      processingTime: 'Instant',
      available: true
    }
  ];
};

// Validate payment method availability
export const validatePaymentMethod = (paymentMethod) => {
  const availableMethods = getAvailablePaymentMethods();
  return availableMethods.some(method => method.id === paymentMethod && method.available);
};

export default {
  createCheckoutSession,
  retrieveCheckoutSession,
  createPaymentIntent,
  calculateFees,
  getFeeInfo,
  getAvailablePaymentMethods,
  validatePaymentMethod
};
