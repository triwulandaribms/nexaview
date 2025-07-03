'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Lock, User, FolderClosed } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Link from 'next/link'

export default function Integration() {
  const [activeTab, setActiveTab] = useState('Agents')

  const tabs = [
    'Agents',
    'Tools', 
    'AI Chains'
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.main 
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <PageHeader 
            title="Integration"
            subtitle="Explore a centralized hub of advanced, ready-to-deploy AI solutions, crafted to streamline integration and optimize workflows in a single, accessible location"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex items-center gap-4">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab}
                className="px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer bg-white"
                style={{
                  background: activeTab === tab ? 'var(--primary)' : '',
                  color: activeTab === tab ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === tab ? 'var(--primary)' : 'var(--border-light)'}`
                }}
                onClick={() => setActiveTab(tab)}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search Bar - Hide on Tools tab */}
        {activeTab !== 'Tools' && (
          <>
            <motion.div className="mb-12" variants={itemVariants}>
              <motion.div 
                className="relative max-w-md"
                transition={{ duration: 0.2 }}
              >
                <div>
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                </div>
                <motion.input
                  type="text"
                  placeholder={`Search ${activeTab.slice(0, -1)}`}
                  className="w-full pl-10 pr-4 py-2 rounded-md border transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--surface-elevated)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--primary)'
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Empty State */}
            <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              className="flex flex-col items-center justify-center py-12 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Illustration Container */}
              <motion.div 
                className="relative mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              >
                {/* Background Circle */}
                <motion.div 
                  className="w-48 h-48 rounded-full flex items-center justify-center relative" 
                  style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)' }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                  >
                    <FolderClosed className="size-20 text-primary" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Empty State Text */}
              <motion.h3 
                className="text-xl font-semibold mb-6 text-center" 
                style={{ color: 'var(--text-primary)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                No published {activeTab} available
              </motion.h3>

              {/* Create Button */}
              <Link href={`/agents`}>
                <motion.button 
                  className="flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 cursor-pointer hover:opacity-90" 
                  style={{ background: 'var(--primary)', color: 'var(--text-inverse)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  Create {activeTab}
                </motion.button>
              </Link>
            </motion.div>
          </AnimatePresence>
          </>
        )}

        

                {/* Tools Table */}
        <AnimatePresence mode="wait">
          {activeTab === 'Tools' && (
            <motion.div 
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Search Bar for Tools */}
              <motion.div className="mb-12">
                <motion.div 
                  className="relative max-w-md"
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  </div>
                  <motion.input
                    type="text"
                    placeholder="Search Tool"
                    className="w-full pl-10 pr-4 py-2 rounded-md border transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      background: 'var(--surface-elevated)',
                      borderColor: 'var(--border-light)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--primary)'
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Tools Table */}
              <motion.div 
                className="rounded-md overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Table Header */}
                <div 
                  className="grid grid-cols-2 gap-4 p-4 font-medium text-sm mb-10 bg-white border rounded-md"
                  style={{
                    borderColor: 'var(--border-light)',
                    color: 'var(--primary)'
                  }}
                >
                  <div>Tool Name</div>
                  <div>Description</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-2" style={{ borderColor: 'var(--border-light)' }}>
                  {[
                    {
                      name: 'PDF to Markdown',
                      description: 'A tool to convert a PDF file into into Markdown.'
                    },
                    {
                      name: 'PDF to Text',
                      description: 'A tool to convert PDF file to text'
                    },
                    {
                      name: 'Google Search Tool',
                      description: 'The name of the topic on which the tool will conduct Google..'
                    },
                    {
                      name: 'Web Researcher Tool',
                      description: 'The name of the topic on which the tool will conduct resear..'
                    }
                  ].map((tool, index) => (
                    <Link href={`/tools/${tool.name}`}
                    key={tool.name}>
                      <motion.div 
                        className="grid grid-cols-2 gap-4 p-3 items-center border-(--border-light) transition-colors duration-200 text-sm hover:border-primary border rounded-md bg-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      >
                        <div 
                          className="font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {tool.name}
                        </div>
                        <div 
                          className=""
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {tool.description}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'AI Chains' && (
            <motion.div 
              key="ai-chains"
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.p 
                className="text-sm" 
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                AI Chains integration will be displayed here
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  )
} 