import api from "./api";

export interface TrackingManifest {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}

export interface TrackingDetails {
  waybill_number: string;
  waybill_date: string;
  waybill_time: string;
  weight: string;
  origin: string;
  destination: string;
  shipper_name: string;
  shipper_address1: string;
  shipper_address2: string;
  shipper_address3: string;
  shipper_city: string;
  receiver_name: string;
  receiver_address1: string;
  receiver_address2: string;
  receiver_address3: string;
  receiver_city: string;
}

export interface TrackingSummary {
  courier_code: string;
  courier_name: string;
  waybill_number: string;
  service_code: string;
  waybill_date: string;
  shipper_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: string;
}

export interface DeliveryStatus {
  status: string;
  pod_receiver: string;
  pod_date: string;
  pod_time: string;
}

export interface TrackingData {
  delivered: boolean;
  summary: TrackingSummary;
  details: TrackingDetails;
  delivery_status: DeliveryStatus;
  manifest: TrackingManifest[];
}

export interface TrackingResponse {
  success: boolean;
  message?: string;
  data?: {
    success: boolean;
    data: TrackingData;
  };
}

export async function trackPackage(
  awb: string,
  courier: string,
): Promise<TrackingResponse> {
  try {
    const response = await api.post("/main/checkout/track", {
      resi: awb,
      courier: courier.toLowerCase(),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Error tracking package:", error);
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Gagal melacak paket. Silakan coba lagi.",
    };
  }
}

export async function getTrackingStatusColor(status: string): Promise<{
  bg: string;
  text: string;
  border: string;
}> {
  const statusLower = status?.toLowerCase() || "";

  if (statusLower === "delivered") {
    return {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    };
  }

  if (
    statusLower.includes("transit") ||
    statusLower.includes("pengiriman") ||
    statusLower.includes("dikirim")
  ) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  }

  return {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };
}

export async function formatTrackingDate(
  date: string,
  time: string,
): Promise<string> {
  try {
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
}
