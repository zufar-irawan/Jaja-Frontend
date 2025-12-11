"use server";

import api from "./api";
import { AxiosError } from "axios";
import type {
  MyVouchersResponse,
  AvailableVouchersResponse,
  ClaimVoucherResponse,
} from "./voucherService";

// Get My Claimed Vouchers
export async function getMyVouchers(): Promise<MyVouchersResponse> {
  try {
    const response = await api.get("/main/voucher/my-vouchers");

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil voucher Anda";
    console.error("Get my vouchers error:", error);
    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
}

// Get Available Vouchers
export async function getAvailableVouchers(): Promise<AvailableVouchersResponse> {
  try {
    const response = await api.get("/main/voucher/available");

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil voucher yang tersedia";
    console.error("Get available vouchers error:", error);
    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
}

// Claim Voucher
export async function claimVoucher(
  kode_voucher: string,
): Promise<ClaimVoucherResponse> {
  try {
    const response = await api.post("/main/voucher/claim", {
      kode_voucher,
    });

    return {
      success: true,
      message: response.data.message || "Voucher berhasil diklaim!",
      kode_voucher: response.data.kode_voucher || kode_voucher,
    };
  } catch (error: unknown) {
    let errorMessage = "Gagal mengklaim voucher";

    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Claim voucher error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
