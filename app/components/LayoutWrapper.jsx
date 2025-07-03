'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './header'
import Sidebar from './sidebar'

const LayoutWrapper = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  // Hide sidebar and header for auth pages and experience center
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') 
  const shouldHideLayout = pathname === '/experience-center' || isAuthPage

  // If it's an auth page, render children without any layout
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        {!shouldHideLayout && (
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          shouldHideLayout ? '' : 'lg:ml-64'
        }`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default LayoutWrapper 