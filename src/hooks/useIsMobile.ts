import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const getIsMobile = () =>
            typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT

        const updateIsMobile = () => setIsMobile(getIsMobile())

        updateIsMobile() // check immediately after mount
        window.addEventListener('resize', updateIsMobile)

        return () => window.removeEventListener('resize', updateIsMobile)
    }, [])

    return isMobile
}

export default useIsMobile