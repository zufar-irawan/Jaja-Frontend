"use client";

import { useEffect, useMemo, useState } from "react";
import { parseBukaTokoData } from "@/utils/tokoService";
import type { MyTokoDetail } from "@/utils/tokoService";
import {
  getProvinces,
  getCities,
  getDistricts,
  getVillages,
  type Province,
  type City,
  type District,
  type Village,
} from "@/utils/userService";

interface EditModalTokoProps {
  open: boolean;
  onClose: () => void;
  data?: Partial<MyTokoDetail>;
  onSubmit?: (payload: StorePayload) => Promise<void> | void;
}

export type StorePayload = {
  nama_toko: string;
  deskripsi_toko: string;
  greating_message: string;
  alamat_toko: string;
  alamat_google: string;
  latitude: string;
  longitude: string;
  provinsi: number;
  kota_kabupaten: number;
  kecamatan: number;
  kelurahan: number;
  kode_pos: string;
  free_ongkir: boolean;
  min_free_ongkir: number;
  pilihan_kurir: string[];
  kurir_service: Record<string, string[]>;
  data_buka_toko: {
    days: string;
    time_open: string;
    time_close: string;
  };
  data_libur_toko: string | null;
};

const defaultPayload: StorePayload = {
  nama_toko: "ZATA.TECH Premium Store",
  deskripsi_toko:
    "Spesialis iPhone, Samsung & Gadget Original 100% Garansi Resmi",
  greating_message: "Terima kasih sudah berkunjung! Ada yang bisa kami bantu?",
  alamat_toko: "Jl. Puri Harapan Jaya No.88, Bekasi Barat",
  alamat_google:
    "Jl. Puri Harapan Jaya, RT.005/RW.012, Pejuang, Medan Satria, Kota Bekasi",
  latitude: "-6.234567",
  longitude: "106.789012",
  provinsi: 12,
  kota_kabupaten: 150,
  kecamatan: 1501,
  kelurahan: 150101,
  kode_pos: "17215",
  free_ongkir: true,
  min_free_ongkir: 200000,
  pilihan_kurir: ["jne", "jnt", "sicepat", "anteraja", "ninja"],
  kurir_service: {
    jne: ["REG", "YES"],
    jnt: ["EZ"],
    sicepat: ["BEST", "REG"],
    anteraja: ["Reguler"],
    ninja: ["Reguler"],
  },
  data_buka_toko: {
    days: "monday,tuesday,wednesday,thursday,friday,saturday,sunday",
    time_open: "08:00",
    time_close: "22:00",
  },
  data_libur_toko: null,
};

const courierOptions = ["jne", "jnt", "sicepat", "anteraja", "ninja"] as const;

const splitCourierString = (value: string | undefined | null): string[] => {
  if (!value) return [];
  return value
    .split(":")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizePilihanKurir = (
  value: MyTokoDetail["pilihan_kurir"] | undefined,
): string[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return splitCourierString(typeof value === "string" ? value : undefined);
};

const normalizeKurirService = (
  value: MyTokoDetail["kurir_service"] | undefined,
): StorePayload["kurir_service"] => {
  if (!value) {
    return defaultPayload.kurir_service;
  }

  const candidate = value as unknown;
  if (typeof candidate === "string") {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") {
        return parsed as StorePayload["kurir_service"];
      }
    } catch (error) {
      console.warn("Failed to parse kurir_service string", error);
    }
    return defaultPayload.kurir_service;
  }

  return value;
};

const normalizeSchedule = (
  value: MyTokoDetail["data_buka_toko"] | undefined,
): StorePayload["data_buka_toko"] => {
  if (!value) {
    return defaultPayload.data_buka_toko;
  }

  if (typeof value === "string") {
    return (
      parseBukaTokoData(value) ?? {
        ...defaultPayload.data_buka_toko,
      }
    );
  }

  return value;
};

export default function EditModalToko({
  open,
  onClose,
  data,
  onSubmit,
}: EditModalTokoProps) {
  const hydratedDefault = useMemo<StorePayload>(() => {
    if (!data) return defaultPayload;

    return {
      ...defaultPayload,
      ...data,
      nama_toko: data.nama_toko ?? defaultPayload.nama_toko,
      deskripsi_toko: data.deskripsi_toko ?? defaultPayload.deskripsi_toko,
      greating_message: data.greating_message ?? "",
      alamat_toko: data.alamat_toko ?? defaultPayload.alamat_toko,
      alamat_google: data.alamat_google ?? "",
      latitude: data.latitude ?? "",
      longitude: data.longitude ?? "",
      provinsi: data.provinsi ?? defaultPayload.provinsi,
      kota_kabupaten: data.kota_kabupaten ?? defaultPayload.kota_kabupaten,
      kecamatan: data.kecamatan ?? defaultPayload.kecamatan,
      kelurahan: data.kelurahan ?? defaultPayload.kelurahan,
      kode_pos: data.kode_pos ?? defaultPayload.kode_pos,
      free_ongkir: (data.free_ongkir ?? "T") === "Y",
      min_free_ongkir: data.min_free_ongkir ?? defaultPayload.min_free_ongkir,
      pilihan_kurir: normalizePilihanKurir(data.pilihan_kurir),
      kurir_service: normalizeKurirService(data.kurir_service),
      data_buka_toko: normalizeSchedule(data.data_buka_toko),
      data_libur_toko: data.data_libur_toko ?? null,
    } as StorePayload;
  }, [data]);

  const [form, setForm] = useState<StorePayload>(hydratedDefault);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Location dropdown states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedDistrictKd, setSelectedDistrictKd] = useState<number | null>(
    null,
  );
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const toArray = <T,>(payload: any): T[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
  };

  useEffect(() => {
    setForm(hydratedDefault);
  }, [hydratedDefault]);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await getProvinces(1, 100);
        if (response.success && response.data) {
          setProvinces(toArray<Province>(response.data));
        }
      } catch (error) {
        console.error("Failed to load provinces", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (!form.provinsi) {
        setCities([]);
        setDistricts([]);
        setVillages([]);
        return;
      }

      setLoadingCities(true);
      try {
        const response = await getCities(form.provinsi, 1, 100);
        if (response.success && response.data) {
          setCities(toArray<City>(response.data));
        }
      } catch (error) {
        console.error("Failed to load cities", error);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [form.provinsi]);

  // Load districts when city changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!form.kota_kabupaten) {
        setDistricts([]);
        setVillages([]);
        return;
      }

      setLoadingDistricts(true);
      try {
        const response = await getDistricts(form.kota_kabupaten, 1, 100);
        if (response.success && response.data) {
          setDistricts(toArray<District>(response.data));
        }
      } catch (error) {
        console.error("Failed to load districts", error);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [form.kota_kabupaten]);

  // Load villages when district changes
  useEffect(() => {
    const loadVillages = async () => {
      if (!selectedDistrictKd) {
        setVillages([]);
        return;
      }

      setLoadingVillages(true);
      try {
        const response = await getVillages(String(selectedDistrictKd), 1, 100);
        if (response.success && response.data) {
          setVillages(toArray<Village>(response.data));
        }
      } catch (error) {
        console.error("Failed to load villages", error);
      } finally {
        setLoadingVillages(false);
      }
    };
    loadVillages();
  }, [selectedDistrictKd]);

  if (!open) return null;

  const updateField = <K extends keyof StorePayload>(
    key: K,
    value: StorePayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleProvinceChange = (provinceId: number) => {
    setForm((prev) => ({
      ...prev,
      provinsi: provinceId,
      kota_kabupaten: 0,
      kecamatan: 0,
      kelurahan: 0,
    }));
    setCities([]);
    setDistricts([]);
    setVillages([]);
    setSelectedDistrictKd(null);
  };

  const handleCityChange = (cityId: number) => {
    setForm((prev) => ({
      ...prev,
      kota_kabupaten: cityId,
      kecamatan: 0,
      kelurahan: 0,
    }));
    setDistricts([]);
    setVillages([]);
    setSelectedDistrictKd(null);
  };

  const handleDistrictChange = (districtId: number) => {
    const selectedDistrict = districts.find(
      (d) => d.kecamatan_id === districtId,
    );
    setForm((prev) => ({
      ...prev,
      kecamatan: districtId,
      kelurahan: 0,
    }));
    setVillages([]);
    setSelectedDistrictKd(selectedDistrict?.kecamatan_id || null);
  };

  const handleVillageChange = (villageId: number) => {
    setForm((prev) => ({
      ...prev,
      kelurahan: villageId,
    }));
  };

  const toggleCourier = (courier: string) => {
    setForm((prev) => {
      const exists = prev.pilihan_kurir.includes(courier);
      return {
        ...prev,
        pilihan_kurir: exists
          ? prev.pilihan_kurir.filter((item) => item !== courier)
          : [...prev.pilihan_kurir, courier],
      };
    });
  };

  const updateCourierServices = (courier: string, value: string) => {
    const services = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      kurir_service: {
        ...prev.kurir_service,
        [courier]: services,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await onSubmit?.(form);
      setMessage("Perubahan toko berhasil disimpan.");
    } catch (error: any) {
      console.error("Failed to update store", error);
      setMessage(error?.message || "Gagal menyimpan perubahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Profil Toko
            </h2>
            <p className="text-sm text-gray-500">
              Perbarui informasi toko kamu kapan saja.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          {message && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Nama Toko
              </label>
              <input
                type="text"
                value={form.nama_toko}
                onChange={(e) => updateField("nama_toko", e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Pesan Sambutan
              </label>
              <input
                type="text"
                value={form.greating_message}
                onChange={(e) =>
                  updateField("greating_message", e.target.value)
                }
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Deskripsi Toko
            </label>
            <textarea
              value={form.deskripsi_toko}
              onChange={(e) => updateField("deskripsi_toko", e.target.value)}
              className="min-h-[120px] rounded-xl border border-gray-200 px-4 py-3 text-sm"
              required
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Provinsi
              </label>
              <select
                value={form.provinsi || ""}
                onChange={(e) => handleProvinceChange(Number(e.target.value))}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                disabled={loadingProvinces}
              >
                <option value="">
                  {loadingProvinces ? "Memuat..." : "Pilih Provinsi"}
                </option>
                {provinces.map((province) => (
                  <option
                    key={province.province_id}
                    value={province.province_id}
                  >
                    {province.province}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Kota/Kabupaten
              </label>
              <select
                value={form.kota_kabupaten || ""}
                onChange={(e) => handleCityChange(Number(e.target.value))}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                disabled={!form.provinsi || loadingCities}
              >
                <option value="">
                  {loadingCities ? "Memuat..." : "Pilih Kota/Kabupaten"}
                </option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.type} {city.city_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Kecamatan
              </label>
              <select
                value={form.kecamatan || ""}
                onChange={(e) => handleDistrictChange(Number(e.target.value))}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                disabled={!form.kota_kabupaten || loadingDistricts}
              >
                <option value="">
                  {loadingDistricts ? "Memuat..." : "Pilih Kecamatan"}
                </option>
                {districts.map((district) => (
                  <option
                    key={district.kecamatan_id}
                    value={district.kecamatan_id}
                  >
                    {district.kecamatan}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Kelurahan
              </label>
              <select
                value={form.kelurahan || ""}
                onChange={(e) => handleVillageChange(Number(e.target.value))}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                disabled={!form.kecamatan || loadingVillages}
              >
                <option value="">
                  {loadingVillages ? "Memuat..." : "Pilih Kelurahan"}
                </option>
                {villages.map((village) => (
                  <option
                    key={village.kelurahan_id}
                    value={village.kelurahan_id}
                  >
                    {village.kelurahan_desa}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Kode Pos
              </label>
              <input
                type="text"
                value={form.kode_pos}
                onChange={(e) => updateField("kode_pos", e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Alamat Toko
            </label>
            <textarea
              value={form.alamat_toko}
              onChange={(e) => updateField("alamat_toko", e.target.value)}
              className="min-h-[100px] rounded-xl border border-gray-200 px-4 py-3 text-sm"
              required
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Free Ongkir
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.free_ongkir}
                    onChange={(e) =>
                      updateField("free_ongkir", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Aktifkan free ongkir
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Min. Free Ongkir
              </label>
              <input
                type="number"
                value={form.min_free_ongkir}
                onChange={(e) =>
                  updateField("min_free_ongkir", Number(e.target.value) || 0)
                }
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                min={0}
                step={1000}
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Pilihan Kurir
            </h3>
            <div className="flex flex-wrap gap-3">
              {courierOptions.map((courier) => (
                <label
                  key={courier}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                    {
                      true: "border-blue-200 bg-blue-50 text-blue-700",
                      false:
                        "border-gray-200 text-gray-600 hover:border-gray-300",
                    }[
                      String(form.pilihan_kurir.includes(courier)) as
                        | "true"
                        | "false"
                    ]
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={form.pilihan_kurir.includes(courier)}
                    onChange={() => toggleCourier(courier)}
                  />
                  {courier.toUpperCase()}
                </label>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {form.pilihan_kurir.map((courier) => (
                <div
                  key={courier}
                  className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-4"
                >
                  <label className="text-sm font-medium text-gray-700">
                    Layanan {courier.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    placeholder="Pisahkan dengan koma contoh REG, YES"
                    value={form.kurir_service[courier]?.join(", ") || ""}
                    onChange={(e) =>
                      updateCourierServices(courier, e.target.value)
                    }
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Jam Operasional
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">
                  Hari Operasional
                </label>
                <input
                  type="text"
                  value={form.data_buka_toko.days}
                  onChange={(e) =>
                    updateField("data_buka_toko", {
                      ...form.data_buka_toko,
                      days: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Buka</label>
                <input
                  type="time"
                  value={form.data_buka_toko.time_open}
                  onChange={(e) =>
                    updateField("data_buka_toko", {
                      ...form.data_buka_toko,
                      time_open: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Tutup</label>
                <input
                  type="time"
                  value={form.data_buka_toko.time_close}
                  onChange={(e) =>
                    updateField("data_buka_toko", {
                      ...form.data_buka_toko,
                      time_close: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Data Libur Toko
            </label>
            <input
              type="text"
              value={form.data_libur_toko ?? ""}
              onChange={(e) =>
                updateField("data_libur_toko", e.target.value || null)
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
              placeholder="Contoh: 2024-12-25"
            />
          </section>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
