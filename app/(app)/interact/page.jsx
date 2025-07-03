'use client'
import React, { useState } from 'react'
import { Search, FileText, CheckCircle } from 'lucide-react'
import PageHeader from '@/app/components/PageHeader'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Interact() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const conversationalAgents = [
    // This section shows "1-1 of 1" but no actual agents are displayed in the image
  ]

  const agenticProcessAutomations = [
    {
      id: 1,
      icon: "📄",
      href: "/interact/pdf-to-markdown",
      title: "PDF to Markdown",
      description: "A tool to convert a PDF file into into Markdown.",
      executions: 0,
      bgColor: "#8b5cf6"
    },
    {
      id: 2,
      icon: "📄", 
      href: "/interact/pdf-to-text",
      title: "PDF to Text",
      description: "A tool to convert PDF file to text",
      executions: 0,
      bgColor: "#8b5cf6"
    },
    {
      id: 3,
      icon: "🔍",
      href: "/interact/google-search",
      title: "Google Search Tool", 
      description: "The name of the topic on which the tool will conduct Google Search.",
      executions: 1,
      bgColor: "#8b5cf6"
    },
    {
      id: 4,
      icon: "🔍",
      href: "/interact/web-researcher",
      title: "Web Researcher Tool",
      description: "The name of the topic on which the tool will conduct research.",
      executions: 0,
      bgColor: "#8b5cf6"
    }
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
        {/* Header using component */}
        <div>
          <PageHeader 
            title="Interact"
            subtitle="Use your published Agents, Tools, and AI Chains."
          />
        </div>

        {/* Filter and Search */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-2">
            <motion.button 
              className="px-4 py-2 rounded-md font-medium border cursor-pointer"
              style={{
                background: activeFilter === 'All' ? 'var(--primary)' : 'transparent',
                color: activeFilter === 'All' ? 'var(--text-inverse)' : 'var(--text-primary)',
                borderColor: activeFilter === 'All' ? 'var(--primary)' : 'var(--border-medium)'
              }}
              onClick={() => setActiveFilter('All')}
            >
              All
            </motion.button>
          </div>
          
          <motion.div 
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search application"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-medium)',
                width: '300px'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Conversational Agents Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Conversational Agents
            </motion.h2>
            <motion.span 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              1-1 of 1
            </motion.span>
          </div>
          
          {/* Empty state for conversational agents */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-md border text-center"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border-light)'
            }}
          >
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              No conversational agents found
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Agentic Process Automations Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Agentic Process Automations
            </motion.h2>
            <motion.span 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              1-4 of 4
            </motion.span>
          </div>

          {/* Automation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {agenticProcessAutomations.map((automation, index) => (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className='rounded-md bg-white'
              >
                <Link 
                  href={automation.href}
                  className="p-6 rounded-md cursor-pointer text-left flex flex-col h-full border hover:border-(--primary) border-black/10"
                >
                  {/* Icon and Title */}
                  <div className="flex-1">
                    <motion.div 
                      className="flex items-center gap-3 mb-4"
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-md flex items-center justify-center text-lg"
                        style={{
                          background: automation.bgColor,
                          color: 'white'
                        }}
                      >
                        {automation.icon}
                      </motion.div>
                      <h3 
                        className="font-bold text-base flex-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {automation.title}
                      </h3>
                    </motion.div>

                    {/* Description */}
                    <p 
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {automation.description}
                    </p>
                  </div>

                  {/* Executions */}
                  <motion.div 
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                    >
                      <CheckCircle 
                        className="h-4 w-4" 
                        style={{ color: automation.executions > 0 ? 'var(--primary)' : 'var(--text-muted)' }}
                      />
                    </motion.div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {automation.executions} executions
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.main>
  )
} 