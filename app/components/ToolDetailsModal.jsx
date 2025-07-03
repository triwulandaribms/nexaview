'use client'
import React from 'react'
import { X, Download, Star, Calendar, Tag, Settings, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ToolDetailsModal({ isOpen, onClose, tool }) {
  if (!tool) return null

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden"
              style={{ background: 'var(--surface-elevated)' }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                    style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                  >
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h2 
                      className="text-xl font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {tool.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="text-xs px-2 py-1 rounded-md font-medium"
                        style={{ 
                          background: 'var(--primary-light)', 
                          color: 'var(--primary)' 
                        }}
                      >
                        {tool.type}
                      </span>
                      <span 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {tool.categories !== '--' ? tool.categories : 'No category'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-medium"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Run Tool
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-md"
                    style={{
                      background: 'var(--surface-secondary)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Star className="h-4 w-4" />
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
              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-3"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Description
                      </h3>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {tool.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-3"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Features
                      </h3>
                      <ul className="space-y-2">
                        {tool.type === 'Basic' ? (
                          <>
                            <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              Simple and straightforward operation
                            </li>
                            <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              No complex branching logic
                            </li>
                            <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              Quick setup and execution
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              Advanced branching capabilities
                            </li>
                            <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              Parallel workflow execution
                            </li>
                            <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              Enhanced efficiency and flexibility
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Usage Instructions */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-3"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        How to Use
                      </h3>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                            style={{ background: 'var(--primary)', color: 'var(--text-inverse)' }}
                          >
                            1
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              Configure Input
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Set up your input parameters and data sources
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                            style={{ background: 'var(--primary)', color: 'var(--text-inverse)' }}
                          >
                            2
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              Run Processing
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Execute the tool with your configured settings
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                            style={{ background: 'var(--primary)', color: 'var(--text-inverse)' }}
                          >
                            3
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              Download Results
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Get your processed output in the desired format
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Tool Info */}
                    <div 
                      className="p-4 rounded-lg"
                      style={{ background: 'var(--surface-secondary)' }}
                    >
                      <h4 
                        className="font-semibold mb-3"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Tool Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                          <div>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Created</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {tool.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                          <div>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Last Edited</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {tool.lastEdited}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                          <div>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Category</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {tool.categories !== '--' ? tool.categories : 'Uncategorized'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium"
                        style={{
                          background: 'var(--primary)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        <Play className="h-4 w-4" />
                        Run Tool
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium border"
                        style={{
                          background: 'var(--surface-elevated)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-light)'
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Export Tool
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium border"
                        style={{
                          background: 'var(--surface-elevated)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-light)'
                        }}
                      >
                        <Settings className="h-4 w-4" />
                        Edit Tool
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 