import { NextResponse } from "next/server";
import {
    getWishlistProducts,
    toggleWishlistProduct,
} from "@/utils/wishlistService";

export async function GET() {
    const result = await getWishlistProducts();

    return NextResponse.json(result, {
        status: result.success ? 200 : 400,
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const productId = Number(body?.id_produk);

        if (!productId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "id_produk tidak valid",
                },
                { status: 400 },
            );
        }

        const result = await toggleWishlistProduct(productId);

        return NextResponse.json(result, {
            status: result.success ? 200 : 400,
        });
    } catch (error: any) {
        console.error("Wishlist POST handler error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal memproses permintaan wishlist",
            },
            { status: 500 },
        );
    }
}
