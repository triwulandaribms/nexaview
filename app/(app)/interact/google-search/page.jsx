'use client'
import React, { useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function GoogleSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleRunTool = () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query')
      return
    }
    // Handle tool execution here
    console.log('Running Google Search for:', searchQuery)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    disabled: {
      opacity: 0.5,
      backgroundColor: '#9ca3af'
    },
    enabled: {
      opacity: 1,
      backgroundColor: '#8b5cf6',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.2)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      y: 0,
      transition: {
        duration: 0.1
      }
    }
  }

  return (
    <motion.main 
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ background: 'var(--background)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{}}
            whileTap={{}}
          >
            <Link 
              href="/interact"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors flex"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { delay: 0.2, duration: 0.5 }
            }}
          >
            Google Search Tool
          </motion.h1>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="rounded-lg border p-8"
          style={{
            background: 'var(--surface-elevated)',
            borderColor: 'var(--border-light)'
          }}
          variants={cardVariants}
          whileHover={{
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Icon and Title */}
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4"
              style={{
                background: '#8b5cf6',
                color: 'white'
              }}
              variants={iconVariants}
              whileHover="hover"
            >
              🔍
            </motion.div>
            <motion.h2 
              className="text-xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.4, duration: 0.5 }
              }}
            >
              Google Search Tool
            </motion.h2>
            <motion.p 
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.5, duration: 0.5 }
              }}
            >
              The name of the topic on which the tool will conduct Google Search.
            </motion.p>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { delay: 0.6, duration: 0.5 }
              }}
            >
              Enter your search query
            </motion.h3>
            <motion.p 
              className="text-sm mb-6"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { delay: 0.7, duration: 0.5 }
              }}
            >
              Type what you want to search for
            </motion.p>

            {/* Search Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.8, duration: 0.5 }
              }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your search query..."
                className="w-full pl-10 pr-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                style={{
                  background: 'var(--surface-base)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-medium)'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Run Tool Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleRunTool}
              className="w-full py-3 px-6 rounded-md font-medium text-white"
              variants={buttonVariants}
              animate={searchQuery.trim() ? "enabled" : "disabled"}
              whileHover={searchQuery.trim() ? "hover" : {}}
              whileTap={searchQuery.trim() ? "tap" : {}}
              disabled={!searchQuery.trim()}
            >
              🚀 Run Tool
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  )
} 