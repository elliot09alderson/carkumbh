import api from './axios';

export interface CreateOrderData {
  name: string;
  number: string;
  address: string;
  package: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  name: string;
  number: string;
  address: string;
  package: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  token: string;
  booking: {
    _id: string;
    token: string;
    name: string;
    number: string;
    address: string;
    package: string;
    paymentMode: string;
    isPaid: boolean;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    gstAmount: number;
    totalAmountPaid: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PriceBreakdown {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  breakdown: {
    gst: number;
  };
}

export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  const { data: response } = await api.post('/payments/create-order', data);
  return response;
};

export const verifyPayment = async (data: VerifyPaymentData): Promise<VerifyPaymentResponse> => {
  const { data: response } = await api.post('/payments/verify', data);
  return response;
};

export const getPriceBreakdown = async (packageAmount: string): Promise<PriceBreakdown> => {
  const { data: response } = await api.get(`/payments/price-breakdown/${packageAmount}`);
  return response;
};
