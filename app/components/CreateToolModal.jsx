'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Check } from 'lucide-react'

export default function CreateToolModal({ isOpen, onClose }) {
  const [selectedToolType, setSelectedToolType] = useState('Basic')

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black/10 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 448 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md h-full bg-[var(--surface-elevated)] rounded-s-3xl shadow-lg flex flex-col border-l border-[var(--border-light)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Create Tool</h2>
          <button
            className="text-[var(--text-secondary)] hover:text-[var(--primary)] text-2xl font-bold transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Tool Icon Section */}
          <div className="mb-6 flex items-center gap-4">
            <label 
              className="border-2 border-dashed rounded-lg size-20 flex items-center justify-center text-center cursor-pointer hover:border-[var(--primary)] transition-colors"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
              <div className="text-2xl font-bold" style={{ color: 'var(--text-tertiary)' }}>+</div>
            </label>
            <div className="">
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Tool icon (Optional)
              </label>
              <div className="text-xs text-[var(--text-secondary)] mb-3">
                Maximum Size: 1 Mb<br />
                Supported formats: .jpg, .png, .jpeg
              </div>
            </div>
          </div>

          {/* Tool Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Tool Name
            </label>
            <input
              type="text"
              className="w-full border border-[var(--border-light)] rounded-md px-3 py-2 bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Enter tool name"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Categories
            </label>
            <select className="w-full border border-[var(--border-light)] rounded-md px-3 py-2 bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
              <option value="">Select tool category</option>
              <option value="document">Document Processing</option>
              <option value="search">Search & Research</option>
              <option value="ai">AI & ML</option>
              <option value="web">Web Tools</option>
            </select>
          </div>

          {/* Tool Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Tool description
            </label>
            <textarea
              rows={4}
              className="w-full border border-[var(--border-light)] rounded-md px-3 py-2 bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              placeholder="A short description of what this tool is about..."
            />
          </div>

          {/* Tool Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-[var(--text-primary)]">
              Tool type
            </label>
            <div className="space-y-3">
              {/* Basic Option */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedToolType === 'Basic' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-light)]'
                }`}
                onClick={() => setSelectedToolType('Basic')}
              >
                <div className="flex items-start justify-between relative">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-[var(--surface-secondary)]">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-sm border-2" style={{ borderColor: 'var(--text-secondary)' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Basic</div>
                      <div className="text-[12px] text-[var(--text-secondary)] mt-1">
                        Branches of codes not allowed in basic tool setup
                      </div>
                    </div>
                  </div>
                  {selectedToolType === 'Basic' && (
                    <div className="w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center absolute right-0 top-0">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Advance Option */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedToolType === 'Advance' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-light)]'
                }`}
                onClick={() => setSelectedToolType('Advance')}
              >
                <div className="flex items-start justify-between relative">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-md bg-[var(--surface-secondary)]">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-sm border-2" style={{ borderColor: 'var(--text-secondary)' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Advance</div>
                      <div className="text-[12px] text-[var(--text-secondary)] mt-1">
                        Advanced tools feature branching capabilities, enabling parallel workflows for enhanced efficiency
                      </div>
                    </div>
                  </div>
                  {selectedToolType === 'Advance' && (
                    <div className="w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center absolute right-0 top-0">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[var(--border-light)] flex justify-between">
          <button
            className="px-6 py-2 rounded-md font-medium transition-all duration-200 border border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-md font-medium transition-all duration-200 bg-[var(--primary)] text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            onClick={onClose}
          >
            Create
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 