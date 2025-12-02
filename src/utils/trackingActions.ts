"use server";

import { trackPackage, type TrackingResponse } from "./trackingService";

export async function getTracking(
  awb: string,
  courier: string,
): Promise<TrackingResponse> {
  try {
    const response = await trackPackage(awb, courier);
    return response;
  } catch (error: unknown) {
    console.error("Error in getTracking action:", error);
    return {
      success: false,
      message: "Gagal melacak paket. Silakan coba lagi.",
    };
  }
}
