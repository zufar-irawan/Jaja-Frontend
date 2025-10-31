"use client"

import { useRouter } from 'next/navigation'

export default function Auth() {
    const router = useRouter()

    router.push('/auth/login')

    return null
}