'use client'

import { createContext, useContext } from 'react'
import type { UserProfile } from '@/utils/userService'

export interface ClientAreaContextValue {
    user?: UserProfile
    isLoading: boolean
    refetch: () => Promise<void>
}

const ClientAreaContext = createContext<ClientAreaContextValue | undefined>(undefined)

export function ClientAreaProvider({ value, children }: { value: ClientAreaContextValue; children: React.ReactNode }) {
    return <ClientAreaContext.Provider value={value}>{children}</ClientAreaContext.Provider>
}

export function useClientArea() {
    const ctx = useContext(ClientAreaContext)
    if (!ctx) throw new Error('useClientArea must be used inside <ClientAreaProvider>')
    return ctx
}