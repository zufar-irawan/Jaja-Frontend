import { NextResponse } from "next/server";
import { getMyToko } from "@/utils/tokoService";

export async function GET() {
    try {
        const toko = await getMyToko();

        return NextResponse.json(
            {
                success: true,
                toko,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("/api/toko/me error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Gagal memeriksa status toko",
            },
            { status: 500 },
        );
    }
}
