'use client'
import React, { useState } from 'react'
import { X, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ModelConfigModal({ isOpen, onClose, model }) {
  const [useSimplAIKey, setUseSimplAIKey] = useState(true)
  const [apiKey, setApiKey] = useState('')

  if (!model) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-xl"
            style={{ background: 'var(--surface-elevated)' }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div>
                <h2 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {model.name}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md font-medium text-sm"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--text-inverse)'
                  }}
                >
                  Save
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-md"
                  style={{
                    background: 'var(--surface-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Select API keys Section */}
              <div className="mb-8">
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Select API keys
                </h3>

                {/* SimplAI API key Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        background: 'var(--primary)', 
                        color: 'var(--text-inverse)' 
                      }}
                    >
                      S
                    </div>
                    <span 
                      className="font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      SimplAI API key
                    </span>
                  </div>
                  
                  <motion.button
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{
                      background: useSimplAIKey ? 'var(--primary)' : 'var(--surface-secondary)'
                    }}
                    onClick={() => setUseSimplAIKey(!useSimplAIKey)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                      animate={{
                        x: useSimplAIKey ? 24 : 4,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* API Key Details */}
                {useSimplAIKey && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-11 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Billed at provider rate plus 20%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Rate limits are shared by all users across SimplAI
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* API key details Section */}
              <div className="space-y-4">
                <h3 
                  className="text-base font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  API key details
                </h3>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label 
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      API key
                    </label>
                    <Info className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 text-sm"
                    style={{
                      background: 'var(--surface-elevated)',
                      borderColor: 'var(--border-light)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--primary)'
                    }}
                    disabled={useSimplAIKey}
                  />
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-md font-medium text-sm"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--text-inverse)'
                  }}
                  disabled={useSimplAIKey && !apiKey.trim()}
                >
                  Save
                </motion.button>
              </div>

              {/* Model Info */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-4 mb-4">
                  {/* Model Logo */}
                  {model.logo?.type === 'colorful' ? (
                    <div className="flex items-center space-x-1">
                      {model.logo.colors.map((color, colorIndex) => (
                        <div 
                          key={colorIndex}
                          className="w-3 h-3 rounded-full"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                      style={{
                        background: 'var(--text-primary)',
                        color: 'var(--surface-elevated)'
                      }}
                    >
                      {model.logo?.icon || model.name.charAt(0)}
                    </div>
                  )}
                  
                  <div>
                    <h4 
                      className="font-medium text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {model.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-md"
                        style={{
                          background: model.status === 'CONNECTED' ? '#10B981' : 'var(--surface-secondary)',
                          color: model.status === 'CONNECTED' ? 'white' : 'var(--text-secondary)'
                        }}
                      >
                        {model.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Model Description */}
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {model.name.includes('embed') 
                    ? 'This is an embedding model used for converting text into vector representations for semantic search and similarity matching.'
                    : 'This is a language model used for text generation, conversation, and various NLP tasks.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 