'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function withGuest(Component) {
  return function GuestOnlyComponent(props) {
    const router = useRouter()
    const token = Cookies.get('token')

    useEffect(() => {
      if (token) {
        return router.push('/dashboard')
      }
    }, [])

    return <Component {...props} />
  }
}
