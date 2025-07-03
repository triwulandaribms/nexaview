'use client'
import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'

const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    // Add lenis class to html element
    document.documentElement.classList.add('lenis')

    // RAF loop
    function raf(time) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      document.documentElement.classList.remove('lenis')
    }
  }, [])

  return <>{children}</>
}

export default LenisProvider 