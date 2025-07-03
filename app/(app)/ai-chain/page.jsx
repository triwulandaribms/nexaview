'use client'
import React, { useState } from 'react'
import { Search, Plus, Download, List, Grid3X3, Package, MoreHorizontal } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { motion } from 'framer-motion'

export default function AIChain() {
  const [activeTab, setActiveTab] = useState('My AI chains')
  const [viewMode, setViewMode] = useState('list')

  const tabs = [
    'My AI chains',
    'Favourite AI chains'
  ]

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div>
          <PageHeader 
            title="AI chain"
            subtitle="AI Chain refers to a structured sequence of operations designed to automate and optimize tasks"
          />
        </div>

        {/* Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-8 border-b" style={{ borderColor: 'var(--border-light)' }}>
            {tabs.map((tab, index) => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.98 }}
                className="pb-4 px-1 font-medium cursor-pointer relative"
                style={{
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search and Actions Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
        >
          {/* Search Bar */}
          <motion.div 
            className="relative max-w-md flex-1"
          >
            <div>
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-tertiary)' }}
              />
            </div>
            <input
              type="text"
              placeholder="Search AI chain"
              className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2"
              style={{
                background: 'var(--surface-elevated)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--primary)'
              }}
            />
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium cursor-pointer"
              style={{
                background: 'var(--primary)',
                color: 'var(--text-inverse)'
              }}
            >
              <Plus className="h-4 w-4" />
              Create AI chain
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium cursor-pointer border"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-light)'
              }}
            >
              <Download className="h-4 w-4" />
              Import AI chain
            </motion.button>

            {/* View Mode Buttons */}
            <motion.div 
              className="flex items-center rounded-md border overflow-hidden" 
              style={{ borderColor: 'var(--border-light)' }}
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="p-2 cursor-pointer"
                style={{
                  background: viewMode === 'list' ? 'var(--primary)' : 'var(--surface-elevated)',
                  color: viewMode === 'list' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                }}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="p-2 cursor-pointer border-l"
                style={{
                  background: viewMode === 'grid' ? 'var(--primary)' : 'var(--surface-elevated)',
                  color: viewMode === 'grid' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  borderColor: 'var(--border-light)'
                }}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Table Headers and Empty State */}
        {activeTab === 'My AI chains' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Desktop Table Headers */}
            <div className="hidden lg:block">
              <motion.div 
                className="rounded-md border overflow-hidden"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)'
                }}
              >
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 p-4 border-b font-medium text-sm" style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-secondary)'
                }}>
                  <div>Chain Name</div>
                  <div className="col-span-2">Description</div>
                  <div>Chain type</div>
                  <div>Chain categories</div>
                  <div>Created At</div>
                  <div>Last edited at</div>
                </div>
              </motion.div>
            </div>

            {/* Empty State */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              {/* Illustration Container */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-8"
              >
                {/* Custom Box Illustration */}
                <div className="relative">
                  {/* Open Box */}
                  <motion.div 
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="w-24 h-16 rounded-lg border-2 relative"
                  >
                    {/* Box Top Flaps */}
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="absolute -top-2 left-2 w-8 h-4 rounded-t-md border-2"
                    />
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="absolute -top-2 right-2 w-8 h-4 rounded-t-md border-2"
                    />

                    {/* Box Content Area */}
                    <div className="absolute inset-2 flex items-center justify-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="w-2 h-2 rounded-full opacity-30" 
                        style={{ background: 'var(--primary)' }}
                      />
                    </div>

                    {/* Floating Elements */}
                    <motion.div 
                      initial={{ x: 20, y: -20, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 0.6 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="absolute -top-6 -right-2 w-3 h-3 rounded-full" 
                      style={{ background: 'var(--primary-light)' }}
                    />
                    <motion.div 
                      initial={{ x: -20, y: -20, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 0.4 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                      className="absolute -top-4 -left-1 w-2 h-2 rounded-full" 
                      style={{ background: 'var(--primary)' }}
                    />
                  </motion.div>

                  {/* Bottom Shadow */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.2 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="absolute -bottom-1 left-2 right-2 h-2 rounded-full" 
                    style={{ 
                      background: 'linear-gradient(90deg, transparent 0%, var(--text-secondary) 50%, transparent 100%)', 
                      filter: 'blur(2px)' 
                    }}
                  />
                </div>
              </motion.div>

              {/* Empty State Text */}
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="text-lg font-medium text-center"
              >
                You do not have any AI chain yet
              </motion.h3>
            </motion.div>
          </motion.div>
        )}

        {/* Placeholder content for Favourite AI chains tab */}
        {activeTab === 'Favourite AI chains' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Desktop Table Headers */}
            <div className="hidden lg:block">
              <motion.div 
                className="rounded-md border overflow-hidden"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)'
                }}
              >
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 p-4 border-b font-medium text-sm" style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-secondary)'
                }}>
                  <div>Chain Name</div>
                  <div className="col-span-2">Description</div>
                  <div>Chain type</div>
                  <div>Chain categories</div>
                  <div>Created At</div>
                  <div>Last edited at</div>
                </div>
              </motion.div>
            </div>

            {/* Empty State for Favourites */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-8 rounded-md border text-center"
            >
              <motion.h3 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-lg font-medium mb-2"
              >
                Favourite AI Chains
              </motion.h3>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Your favourite AI chains will be displayed here
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  )
} 