"use client"

import { useRouter } from 'next/navigation'

export default function MainAuth() {
    const router = useRouter()

    router.push('/main/auth/login')

    return null
}
