'use client'

import { useEffect, useMemo, useState } from "react"
import { type LandingBanner, LANDING_BANNER_BASE_URL } from "@/utils/landingService"

interface HeroCarouselProps {
    banners: LandingBanner[]
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    const slides = useMemo(() => banners ?? [], [banners])

    useEffect(() => {
        if (slides.length <= 1) return
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length])

    if (!slides.length) {
        return (
            <section className="flex w-full min-h-80 items-center justify-center bg-gray-900 px-4 text-center text-3xl text-gray-50 sm:min-h-[360px] sm:px-8 sm:text-4xl lg:min-h-[400px] lg:px-20 lg:text-5xl">
                Welcome to JajaID!
            </section>
        )
    }

    const goToSlide = (direction: 'prev' | 'next') => {
        setActiveIndex((prev) => {
            if (direction === 'next') {
                return (prev + 1) % slides.length
            }
            return (prev - 1 + slides.length) % slides.length
        })
    }

    return (
        <section className="relative w-full overflow-hidden">
            <div className="relative flex w-full items-center justify-center overflow-hidden bg-[#7CC0D8]" style={{ aspectRatio: '512 / 161' }}>
                <div
                    className="flex h-full w-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)`, width: `${slides.length * 100}%` }}
                >
                    {slides.map((banner) => (
                        <div key={banner.id_data} className="flex h-full w-full shrink-0 items-center justify-center">
                            <img
                                src={`${LANDING_BANNER_BASE_URL}${banner.nama_file}`}
                                alt="Hero banner"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    ))}
                </div>

                {slides.length > 1 && (
                    <>
                        <button
                            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 sm:left-6 lg:left-8"
                            onClick={() => goToSlide('prev')}
                            aria-label="Slide sebelumnya"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 sm:right-6 lg:right-8"
                            onClick={() => goToSlide('next')}
                            aria-label="Slide selanjutnya"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {slides.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6 lg:bottom-8">
                        {slides.map((banner, index) => (
                            <button
                                key={banner.id_data}
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? 'bg-white' : 'bg-white/50'}`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
