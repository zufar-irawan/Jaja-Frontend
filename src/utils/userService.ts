"use server"

import api from './api'

export interface UserProfile {
    id_customer: number
    first_name: string
    last_name: string
    nama_lengkap: string
    username: string
    email: string
    telepon: string
    jenis_kelamin?: 'pria' | 'wanita'
    tgl_lahir?: string
    foto_profil?: string
}

export interface UpdateProfileData {
    first_name?: string
    last_name?: string
    nama_lengkap?: string
    username?: string
    telepon?: string
    jenis_kelamin?: string
    tgl_lahir?: string
}

export interface Address {
    id_alamat: number
    label: string
    nama: string
    no_telepon: string
    alamat_lengkap: string
    provinsi_id: number
    provinsi: string
    kota_id: number
    kota: string
    kecamatan_id: number
    kecamatan: string
    kelurahan_id: number
    kelurahan: string
    kode_pos: string
    alamat_koordinat?: string
    latitude?: string
    longitude?: string
    nama_alamat: string
    is_primary: boolean
}

export interface CreateAddressData {
    label: string
    nama: string
    no_telepon: string
    alamat_lengkap: string
    provinsi_id: number
    provinsi: string
    kota_id: number
    kota: string
    kecamatan_id: number
    kecamatan: string
    kelurahan_id: number
    kelurahan: string
    kode_pos: string
    alamat_koordinat?: string
    latitude?: string
    longitude?: string
    nama_alamat: string
}

export interface Province {
    provinsi_kd: number
    provinsi_nm: string
}

export interface City {
    kota_kd: number
    kota_nm: string
    provinsi_kd: number
}

export interface District {
    kecamatan_kd: string
    kecamatan_nm: string
    kota_kd: number
}

export interface Village {
    kelurahan_kd: string
    kelurahan_nm: string
    kecamatan_kd: string
}

export interface ApiResponse<T> {
    success: boolean
    message?: string
    data?: T
}

export interface ResetPassword {
    email: string
    token: string
    new_password: string
}

// User Profile
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
        const response = await api.get('/main/customer/profile')
        return {
            success: true,
            data: response.data.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil profil'
        }
    }
}

export async function updateUserProfile(data: UpdateProfileData): Promise<ApiResponse<UserProfile>> {
    try {
        const response = await api.put('/main/customer/profile', data)
        return {
            success: true,
            message: 'Profil berhasil diperbarui',
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal memperbarui profil'
        }
    }
}

// Address Management
export async function getAddresses(): Promise<ApiResponse<Address[]>> {
    try {
        const response = await api.get('/main/customer/address')
        return {
            success: true,
            data: response.data.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil alamat'
        }
    }
}

export async function createAddress(data: CreateAddressData): Promise<ApiResponse<Address>> {
    try {
        const response = await api.post('/main/customer/address', data)
        return {
            success: true,
            message: 'Alamat berhasil ditambahkan',
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal menambahkan alamat'
        }
    }
}

export async function updateAddress(addressId: number, data: CreateAddressData): Promise<ApiResponse<Address>> {
    try {
        const response = await api.put(`/main/customer/address/${addressId}`, data)
        return {
            success: true,
            message: 'Alamat berhasil diperbarui',
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal memperbarui alamat'
        }
    }
}

export async function deleteAddress(addressId: number): Promise<ApiResponse<void>> {
    try {
        await api.delete(`/main/customer/address/${addressId}`)
        return {
            success: true,
            message: 'Alamat berhasil dihapus'
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal menghapus alamat'
        }
    }
}

export async function setPrimaryAddress(addressId: number): Promise<ApiResponse<void>> {
    try {
        await api.put(`/main/customer/address/${addressId}/primary`)
        return {
            success: true,
            message: 'Alamat utama berhasil diubah'
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengubah alamat utama'
        }
    }
}

// Location Data
export async function getProvinces(page: number = 1, limit: number = 40): Promise<ApiResponse<Province[]>> {
    try {
        const response = await api.get(`/main/location/provinces?page=${page}&limit=${limit}`)
        return {
            success: true,
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil data provinsi'
        }
    }
}

export async function getCities(provinceId: number, page: number = 1, limit: number = 20): Promise<ApiResponse<City[]>> {
    try {
        const response = await api.get(`/main/location/cities?province_id=${provinceId}&page=${page}&limit=${limit}`)
        return {
            success: true,
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil data kota'
        }
    }
}

export async function getDistricts(cityId: number, page: number = 1, limit: number = 20): Promise<ApiResponse<District[]>> {
    try {
        const response = await api.get(`/main/location/districts?city_id=${cityId}&page=${page}&limit=${limit}`)
        return {
            success: true,
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil data kecamatan'
        }
    }
}

export async function getVillages(kecamatanKd: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Village[]>> {
    try {
        const response = await api.get(`/main/location/villages?kecamatan_kd=${kecamatanKd}&page=${page}&limit=${limit}`)
        return {
            success: true,
            data: response.data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil data kelurahan'
        }
    }
}

export async function resetPassword(data: ResetPassword): Promise<ApiResponse<void>> {
    try {
        await api.post('/main/auth/reset-password', data)
        return {
            success: true,
            message: 'Password berhasil direset'
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mereset password'
        }
    }
}