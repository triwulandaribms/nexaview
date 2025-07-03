'use client'
import React, { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const lightTheme = {
  name: 'Light',
  colors: {
    // Light Theme Color Palette
    '--background': '#fafafa',
    '--foreground': '#0f0f23',
    '--primary': '#6366f1',
    '--primary-hover': '#4f46e5',
    '--primary-light': '#eef2ff',
    '--secondary': '#8b5cf6',
    '--secondary-hover': '#7c3aed',
    '--secondary-light': '#f3f4ff',
    '--accent': '#06b6d4',
    '--accent-hover': '#0891b2',
    '--accent-light': '#ecfeff',
    '--surface': '#ffffff',
    '--surface-hover': '#f8fafc',
    '--surface-secondary': '#f1f5f9',
    '--surface-tertiary': '#e2e8f0',
    '--surface-elevated': '#ffffff',
    '--text-primary': '#0f172a',
    '--text-secondary': '#475569',
    '--text-tertiary': '#64748b',
    '--text-inverse': '#ffffff',
    '--text-muted': '#94a3b8',
    '--border-light': '#e2e8f0',
    '--border-medium': '#cbd5e1',
    '--border-strong': '#94a3b8',
    '--header-bg': 'rgba(255, 255, 255, 0.95)',
    '--header-border': '#e2e8f0',
    '--sidebar-bg': '#ffffff',
    '--sidebar-text': '#475569',
    '--sidebar-text-hover': '#0f172a',
    '--sidebar-hover-bg': '#f8fafc',
    '--sidebar-border': '#e2e8f0',
  }
}

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Apply theme colors to CSS variables
    Object.entries(lightTheme.colors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value)
    })
  }, [])

  return (
    <ThemeContext.Provider value={{
      currentTheme: 'light',
      currentThemeData: lightTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
} 