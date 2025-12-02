import { NextResponse } from "next/server";
import { openStore, type OpenStorePayload } from "@/utils/tokoService";

const REQUIRED_FIELDS: Array<keyof OpenStorePayload> = [
    "nama_toko",
    "deskripsi_toko",
    "alamat_toko",
    "provinsi",
    "kota_kabupaten",
    "kecamatan",
    "kelurahan",
    "kode_pos",
];

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const missing = REQUIRED_FIELDS.filter((field) => {
            const value = body?.[field];
            if (typeof value === "number") {
                return Number.isNaN(value) || value === 0;
            }
            return !value;
        });

        if (missing.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Data berikut wajib diisi: ${missing.join(", ")}`,
                },
                { status: 400 },
            );
        }

        const payload: OpenStorePayload = {
            nama_toko: String(body.nama_toko ?? ""),
            deskripsi_toko: String(body.deskripsi_toko ?? ""),
            alamat_toko: String(body.alamat_toko ?? ""),
            provinsi: Number(body.provinsi) || 0,
            kota_kabupaten: Number(body.kota_kabupaten) || 0,
            kecamatan: Number(body.kecamatan) || 0,
            kelurahan: Number(body.kelurahan) || 0,
            kode_pos: String(body.kode_pos ?? ""),
            skor: Number.isFinite(Number(body.skor)) ? Number(body.skor) : 0,
        };

        const result = await openStore(payload);

        return NextResponse.json(result, {
            status: result.success ? 200 : 400,
        });
    } catch (error: any) {
        console.error("/api/toko/open-store error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Terjadi kesalahan pada server",
            },
            { status: 500 },
        );
    }
}
