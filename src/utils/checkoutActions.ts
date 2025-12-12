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
  CreateComplainData,
  CreateComplainResponse,
  ProductTransactionDetailResponse,
  CancelOrderResponse,
  ReceivedOrderResponse,
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

export async function trackShipment(resi: string, courier: string) {
  try {
    const response = await api.post("/main/checkout/track", {
      resi: resi,
      courier: courier,
    });

    return {
      success: true,
      message: response.data.message || "Berhasil melacak resi",
      data: response.data.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal melacak pengiriman";
    console.error("Track shipment error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Create Complain
export async function createComplain(
  data: CreateComplainData,
): Promise<CreateComplainResponse> {
  try {
    const formData = new FormData();

    // Add required fields
    formData.append("invoice", data.invoice);
    formData.append("id_produk", data.id_produk.toString());
    formData.append("jenis_komplain", data.jenis_komplain);
    formData.append("judul_komplain", data.judul_komplain);
    formData.append("komplain", data.komplain);
    formData.append("solusi", data.solusi);

    // Add optional files
    if (data.gambar1) {
      formData.append("gambar1", data.gambar1);
    }
    if (data.gambar2) {
      formData.append("gambar2", data.gambar2);
    }
    if (data.gambar3) {
      formData.append("gambar3", data.gambar3);
    }
    if (data.video) {
      formData.append("video", data.video);
    }

    const response = await api.post("/main/komplain/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data.message || "Komplain berhasil dibuat",
      data: response.data.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal membuat komplain";
    console.error("Create complain error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Get Complain Detail
export async function getComplainDetail(
  idData: number,
  idProduk: number,
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await api.get(
      `/main/transaksi/${idData}/produk/${idProduk}`,
    );

    // Extract complain data from history_komplain
    const complainData = response.data.data?.history_komplain || [];

    return {
      success: true,
      data: {
        history_komplain: complainData,
        rating_saya: response.data.data?.rating_saya || null,
      },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil detail komplain";
    console.error("Get complain detail error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Delete Complain
export async function deleteComplain(
  complainId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/main/komplain/${complainId}`);

    return {
      success: true,
      message: response.data.message || "Komplain berhasil dihapus",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal menghapus komplain";
    console.error("Delete complain error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Delete Rating/Review
export async function deleteRating(
  idData: number,
  idProduk: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(
      `/main/transaksi/${idData}/produk/${idProduk}/rating`,
    );

    return {
      success: true,
      message: response.data.message || "Review berhasil dihapus",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal menghapus review";
    console.error("Delete rating error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Get Product Transaction Detail
export async function getProductTransactionDetail(
  idData: number,
  idProduk: number,
): Promise<ProductTransactionDetailResponse> {
  try {
    const response = await api.get(
      `/main/transaksi/${idData}/produk/${idProduk}`,
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil detail produk transaksi";
    console.error("Get product transaction detail error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Cancel Order
export async function cancelOrder(
  idData: number,
): Promise<CancelOrderResponse> {
  try {
    const response = await api.post(`/main/checkout/${idData}/cancel`);

    return {
      success: true,
      message: response.data.message || "Pesanan berhasil dibatalkan",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal membatalkan pesanan";
    console.error("Cancel order error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Mark Order as Received
export async function markOrderReceived(
  idData: number,
): Promise<ReceivedOrderResponse> {
  try {
    const response = await api.post(`/main/checkout/${idData}/received`);

    return {
      success: true,
      message:
        response.data.message || "Pesanan berhasil dikonfirmasi diterima",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengkonfirmasi penerimaan pesanan";
    console.error("Mark order received error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
