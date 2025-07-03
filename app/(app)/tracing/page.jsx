'use client'
import React, { useState } from 'react'
import { Search, Download, Calendar, ChevronDown, MoreHorizontal } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { motion } from 'framer-motion'

export default function Tracing() {
  const [activeTab, setActiveTab] = useState('Runs')
  const [selectedUser, setSelectedUser] = useState('')
  const [startDate, setStartDate] = useState('01-06-2025')
  const [endDate, setEndDate] = useState('08-06-2025')

  const tabs = [
    'Runs',
    'Pending approval',
    'User Feedbacks'
  ]

  const runs = [
    {
      id: 1,
      name: "google_search_tool",
      version: 1,
      userId: "1871",
      endUserName: "NA",
      endUserId: "NA",
      bulkRunId: "--",
      source: "Tools",
      input: '{"topic":"ex"}'
    },
    {
      id: 2,
      name: "pdf_analyzer_tool",
      version: 2,
      userId: "1872",
      endUserName: "John Doe",
      endUserId: "user_123",
      bulkRunId: "bulk_001",
      source: "Agents",
      input: '{"file":"document.pdf"}'
    }
  ]

  const totalResults = runs.length

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
            title="Tracing"
            subtitle="Monitor and analyze your AI system runs, approvals, and user feedback to optimize performance."
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
                whileHover={{ scale: 1.02 }}
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

        {/* Filters and Actions Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
        >
          {/* Left side - Total results */}
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Total results: {totalResults}
          </div>

          {/* Right side - Filters and Download */}
          <div className="flex items-center gap-3">
            {/* User Select Dropdown */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-md border text-sm cursor-pointer focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)',
                  color: selectedUser ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  '--tw-ring-color': 'var(--primary)'
                }}
              >
                <option value="">Select user</option>
                <option value="1871">User 1871</option>
                <option value="1872">User 1872</option>
                <option value="1873">User 1873</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown 
                  className="h-4 w-4"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              </div>
            </motion.div>

            {/* Date Range Inputs */}
            <div className="flex items-center gap-2">
              <motion.input
                whileHover={{ scale: 1.01 }}
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="01-06-2025"
                className="px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--primary)'
                }}
              />
              
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                to
              </span>
              
              <motion.input
                whileHover={{ scale: 1.01 }}
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="08-06-2025"
                className="px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--primary)'
                }}
              />
            </div>

            {/* Download Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium cursor-pointer"
              style={{
                background: 'var(--primary)',
                color: 'var(--text-inverse)'
              }}
            >
              <Download className="h-4 w-4" />
              Download
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'Runs' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <motion.div 
                className="rounded-md border overflow-hidden"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)'
                }}
              >
                {/* Table Header */}
                <div 
                  className="grid grid-cols-7 gap-4 p-4 border-b font-medium text-sm"
                  style={{
                    background: 'var(--surface-secondary)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div>Run Name</div>
                  <div className="col-span-2">Description</div>
                  <div>Run type</div>
                  <div>Run categories</div>
                  <div>Created At</div>
                  <div>Last edited at</div>
                </div>

                {/* Table Body */}
                {runs.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="grid grid-cols-7 gap-4 p-4 items-center border-b hover:bg-surface-hover"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center text-xs"
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)'
                        }}
                      >
                        🔍
                      </div>
                      <div className="font-medium">
                        {run.name}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {run.input}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {run.source}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {run.version}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {run.createdAt}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {run.lastEditedAt}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {runs.map((run, index) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-md border p-4"
                  style={{
                    background: 'var(--surface-elevated)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  {/* Run Name and Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center text-xs"
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)'
                        }}
                      >
                        🔍
                      </div>
                      <div className="font-medium text-lg">
                        {run.name}
                      </div>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-md cursor-pointer"
                      style={{
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Run Details */}
                  <div className="space-y-2">
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {run.input}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-md" style={{ background: 'var(--surface-secondary)', color: 'var(--text-secondary)' }}>
                        {run.source}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md" style={{ background: 'var(--surface-secondary)', color: 'var(--text-secondary)' }}>
                        {run.version}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span>Created: {run.createdAt}</span>
                      <span>Last edited: {run.lastEditedAt}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'Pending approval' && (
          <div className="p-8 rounded-md border text-center">
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Pending Approvals
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Runs awaiting approval will be displayed here
            </p>
          </div>
        )}

        {activeTab === 'User Feedbacks' && (
          <div className="p-8 rounded-md border text-center">
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              User Feedbacks
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              User feedback and ratings will be displayed here
            </p>
          </div>
        )}
      </motion.div>
    </motion.main>
  )
} 