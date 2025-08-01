'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function ClientAuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      router.replace('/dashboard');
    }

    setChecking(false);
  }, [pathname, router])

  if (checking) {
    // return <LoadingSpinner /> 
    return <div style={{ display: 'none' }} />
  }

  return <>{children}</>
}
