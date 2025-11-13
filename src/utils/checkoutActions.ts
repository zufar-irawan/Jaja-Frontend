"use server";

import api from "./api"
import type { ReviewCheckoutData, ReviewCheckoutResponse, CheckoutData, CheckoutResponse, PaymentData, PaymentResponse } from './checkoutService'

export async function reviewCheckout(data: ReviewCheckoutData): Promise<ReviewCheckoutResponse> {
  try {
    console.log('Review checkout data:', data)

    const response = await api.post('/main/checkout/review', data)

    console.log('Review checkout response:', response.data)

    return {
      success: true,
      message: response.data.message || 'Berhasil memuat preview checkout',
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Review checkout error:', error.response?.data || error)
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal memuat preview checkout'
    }
  }
}

export async function processCheckout(data: CheckoutData): Promise<CheckoutResponse> {
  try {
    console.log('Processing checkout:', data)

    const response = await api.post('/main/transaksi/checkout', data)

    console.log('Checkout response:', response.data)

    return {
      success: true,
      message: response.data.message || 'Checkout berhasil',
      data: response.data.data || response.data
    }
  } catch (error: any) {
    console.error('Checkout error:', error.response?.data || error)
    return {
      success: false,
      message: error.response?.data?.message || 'Checkout gagal'
    }
  }
}

export async function processPayment(data: PaymentData): Promise<PaymentResponse> {
  try {
    console.log('Processing payment:', data)

    const response = await api.post('/main/transaksi/payment', data)

    console.log('Payment response:', response.data)

    return {
      success: true,
      message: response.data.message || 'Payment berhasil dibuat',
      data: response.data.data || response.data
    }
  } catch (error: any) {
    console.error('Payment error:', error.response?.data || error)
    return {
      success: false,
      message: error.response?.data?.message || 'Payment gagal'
    }
  }
}

export async function getTransactionDetail(transactionId: string) {
  try {
    const response = await api.get(`/main/transaksi/${transactionId}`)

    return {
      success: true,
      data: response.data.data || response.data
    }
  } catch (error: any) {
    console.error('Get transaction error:', error.response?.data || error)
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal mengambil detail transaksi'
    }
  }
}

export async function getAllTransactions() {
  try {
    const response = await api.get('/main/transaksi/')

    return {
      success: true,
      data: response.data.data || response.data
    }
  } catch (error: any) {
    console.error('Get transactions error:', error.response?.data || error)
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal mengambil daftar transaksi'
    }
  }
}