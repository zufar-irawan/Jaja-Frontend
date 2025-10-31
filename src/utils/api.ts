"use server"

import axios from 'axios'
import { cookies } from "next/headers";

const BASE_URL = 'https://kb8334ks-3000.asse.devtunnels.ms'

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        const cookieStore = cookies()

        // @ts-ignore
        const token = cookieStore.get('auth-token')?.value

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api