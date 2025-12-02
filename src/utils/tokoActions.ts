"use server";

import api from "./api";
import type { UpdateTokoPayload, UpdateTokoResponse } from "./tokoService";

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
    } catch (error: any) {
        console.error("updateMyToko error - Full error:", error);
        console.error("updateMyToko error - Details:", {
            message: error?.message || "No message",
            status: error?.response?.status || "No status",
            statusText: error?.response?.statusText || "No statusText",
            data: error?.response?.data || "No data",
            config: error?.config
                ? {
                    url: error.config.url,
                    method: error.config.method,
                }
                : "No config",
        });

        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Gagal memperbarui toko",
        };
    }
}
