import { NextResponse } from "next/server";
import { createSellerToko } from "@/utils/tokoService";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const result = await createSellerToko(payload);

        return NextResponse.json(result, {
            status: result.success ? 200 : 400,
        });
    } catch (error: any) {
        console.error("Error handling seller create toko request:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Gagal memproses permintaan",
            },
            { status: 500 },
        );
    }
}
