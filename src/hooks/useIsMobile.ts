import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768

const getIsMobile = () => window.innerWidth < MOBILE_BREAKPOINT

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = getIsMobile();

            if (newIsMobile !== isMobile) {
                setIsMobile(newIsMobile);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [isMobile])

    return isMobile
}

export default useIsMobile