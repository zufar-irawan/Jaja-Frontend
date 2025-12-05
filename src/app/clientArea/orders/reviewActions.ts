"use server";

import {
  submitProductReview,
  type SubmitReviewPayload,
} from "@/utils/productService";

export async function submitReview(payload: SubmitReviewPayload) {
  try {
    const response = await submitProductReview(payload);
    return response;
  } catch (error: unknown) {
    console.error("Error in submitReview action:", error);

    // Return error response
    const errorResponse =
      error && typeof error === "object" && "response" in error
        ? (error.response as { status?: number })
        : null;
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit review";

    return {
      success: false,
      code: errorResponse?.status || 500,
      message: errorMessage,
    };
  }
}
