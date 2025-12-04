"use server";

import api from "./api";
import { AxiosError } from "axios";
import type {
  UpdateTokoPayload,
  UpdateTokoResponse,
} from "./type/tokoInterface";

// Helper function to check if error is AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// Helper function to get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function updateMyToko(
  payload: UpdateTokoPayload,
): Promise<UpdateTokoResponse> {
  try {
    console.log("updateMyToko payload:", JSON.stringify(payload, null, 2));

    const response = await api.patch<UpdateTokoResponse>(
      "/seller/v2/toko/update",
      payload,
    );

    console.log("updateMyToko success:", response.data);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const statusText = isAxiosError(error)
      ? error.response?.statusText
      : undefined;
    const responseData = isAxiosError(error) ? error.response?.data : undefined;
    const config = isAxiosError(error) ? error.config : undefined;

    console.error("updateMyToko error - Full error:", error);
    console.error("updateMyToko error - Details:", {
      message: errorMessage || "No message",
      status: status || "No status",
      statusText: statusText || "No statusText",
      data: responseData || "No data",
      config: config
        ? {
            url: config.url,
            method: config.method,
          }
        : "No config",
    });

    return {
      success: false,
      message:
        (responseData as { message?: string })?.message ||
        errorMessage ||
        "Gagal memperbarui toko",
    };
  }
}
