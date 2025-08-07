'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'

const PUBLIC_GUEST_PATHS = ['/login', '/signup']

export default function GuestOnlyWrapper({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  // useEffect(() => {
    // const token = Cookies.get('token')

    // if (token && PUBLIC_GUEST_PATHS.includes(pathname)) {
    // setTimeout(() => {
    // router.replace('/dashboard')
    //     }, 100)
    //   } else if (!token && !PUBLIC_GUEST_PATHS.includes(pathname)) {
    //     router.replace('/login')
    //   } else {
    //     setChecking(false)
    //   }
    // }, [pathname, router])

    // if (checking) {
    //   return <div style={{ display: 'none' }} />
    // }

    return <>{children}</>
  }
