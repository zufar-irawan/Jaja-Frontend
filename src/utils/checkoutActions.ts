"use server";

import api from "./api";
import type {
  ReviewCheckoutData,
  ReviewCheckoutResponse,
  CheckoutData,
  CheckoutResponse,
  PaymentData,
  PaymentResponse,
  TransactionResponse,
} from "./checkoutService";

export async function reviewCheckout(
  data: ReviewCheckoutData,
): Promise<ReviewCheckoutResponse> {
  try {
    console.log("Review checkout data:", data);
    const response = await api.post("/main/checkout/review", data);
    console.log("Review checkout response:", response.data);

    return {
      success: true,
      message: response.data.message || "Berhasil memuat preview checkout",
      data: response.data.data,
    };
  } catch (error: unknown) {
    console.error("Review checkout error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memuat preview checkout";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function processCheckout(
  data: CheckoutData,
): Promise<CheckoutResponse> {
  try {
    console.log(
      "Processing checkout with data:",
      JSON.stringify(data, null, 2),
    );
    const response = await api.post("/main/transaksi/checkout", data);
    console.log("Checkout response status:", response.status);
    console.log(
      "Checkout response data:",
      JSON.stringify(response.data, null, 2),
    );

    return {
      success: true,
      message: response.data.message || "Checkout berhasil",
      data: response.data.data || response.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Checkout gagal";
    console.error("Checkout error details:", error);

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function processPayment(
  data: PaymentData,
): Promise<PaymentResponse> {
  try {
    console.log("Processing payment:", data);
    const response = await api.post("/main/transaksi/payment", data);
    console.log("Payment response:", response.data);

    return {
      success: true,
      message: response.data.message || "Payment berhasil dibuat",
      provider_payload: response.data.provider_payload,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Payment gagal";
    console.error("Payment error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getTransactionDetail(
  idData: string | number,
): Promise<TransactionResponse> {
  try {
    const response = await api.get(`/main/transaksi/${idData}`);

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil detail transaksi";
    console.error("Get transaction error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getAllTransactions() {
  try {
    const response = await api.get("/main/transaksi/");

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil daftar transaksi";
    console.error("Get transactions error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
