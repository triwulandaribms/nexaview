'use client'
import React, { useState } from 'react'
import { Search, Plus, Minus } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { motion, AnimatePresence } from 'framer-motion'

export default function Connections() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedProviders, setExpandedProviders] = useState(new Set())

  const serviceProviders = {
    "Vector DBs": [
      { id: 1, name: "Pinecone", icon: "🌲", color: "#10B981" },
      { id: 2, name: "Weaviate", icon: "🔷", color: "#3B82F6" },
      { id: 3, name: "Qdrant", icon: "🔵", color: "#6366F1" },
      { id: 4, name: "CountBase", icon: "🗄️", color: "#8B5CF6" }
    ],
    "Models": [
      { id: 5, name: "bedrock", icon: "🪨", color: "#F59E0B" },
      { id: 6, name: "gentemai", icon: "🧠", color: "#EF4444" },
      { id: 7, name: "vertex_ai", icon: "🔺", color: "#10B981" },
      { id: 8, name: "mistral", icon: "🌪️", color: "#8B5CF6" },
      { id: 9, name: "anthropic", icon: "🤖", color: "#F59E0B" },
      { id: 10, name: "elevenlabs", icon: "🎵", color: "#3B82F6" },
      { id: 11, name: "azure", icon: "☁️", color: "#0EA5E9" },
      { id: 12, name: "openai", icon: "⚡", color: "#10B981" },
      { id: 13, name: "gemini", icon: "♊", color: "#8B5CF6" },
      { id: 14, name: "cohere", icon: "🔗", color: "#F59E0B" },
      { id: 15, name: "deepseek", icon: "🔍", color: "#EF4444" },
      { id: 16, name: "gemini", icon: "✨", color: "#6366F1" }
    ]
  }

  const filteredProviders = Object.keys(serviceProviders).reduce((acc, category) => {
    const filtered = serviceProviders[category].filter(provider =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {})

  const toggleProvider = (providerId) => {
    const newExpanded = new Set(expandedProviders)
    if (newExpanded.has(providerId)) {
      newExpanded.delete(providerId)
    } else {
      newExpanded.add(providerId)
    }
    setExpandedProviders(newExpanded)
  }

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
            title="Service providers"
            subtitle="Connect and integrate with various AI service providers to enhance your workflows. Manage connections such as Vector Databases and AI Models, that integrate seamlessly with Simplix/agents to deliver a seamless experience."
          />
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <motion.div 
            className="relative max-w-md"
          >
            <div>
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-tertiary)' }}
              />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2"
              style={{
                background: 'var(--surface-elevated)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--primary)'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Service Provider Sections */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {Object.keys(filteredProviders).map((category, categoryIndex) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
            >
              {/* Category Title */}
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {category}
              </motion.h2>

              {/* Provider List */}
              <motion.div 
                className="space-y-2"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {filteredProviders[category].map((provider, providerIndex) => {
                  const isExpanded = expandedProviders.has(provider.id)
                  return (
                    <motion.div 
                      key={provider.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="rounded-md border"
                      style={{
                        background: 'var(--surface-elevated)',
                        borderColor: isExpanded ? 'var(--primary)' : 'var(--border-light)'
                      }}
                    >
                      {/* Provider Row */}
                      <motion.div 
                        className="flex items-center justify-between p-3 cursor-pointer"
                        onClick={() => toggleProvider(provider.id)}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Provider Info */}
                        <div className="flex items-center gap-3">
                          {/* Provider Icon */}
                          <motion.div 
                            className="w-8 h-8 rounded-md flex items-center justify-center text-sm"
                            style={{
                              background: `${provider.color}20`,
                              color: provider.color
                            }}
                          >
                            {provider.icon}
                          </motion.div>
                          
                          {/* Provider Name */}
                          <span 
                            className="font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {provider.name}
                          </span>
                        </div>

                        {/* Toggle Button */}
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-md cursor-pointer"
                          style={{
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <AnimatePresence mode="wait">
                            {isExpanded ? (
                              <motion.div
                                key="minus"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Minus className="h-4 w-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="plus"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Plus className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </motion.div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 pb-3 border-t overflow-hidden"
                            style={{ borderColor: 'var(--border-light)' }}
                          >
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-2 py-2 text-sm font-medium cursor-pointer"
                              style={{ color: 'var(--primary)' }}
                            >
                              <Plus className="h-3 w-3" />
                              Add another
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        <AnimatePresence>
          {Object.keys(filteredProviders).length === 0 && searchTerm && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
              style={{ color: 'var(--text-secondary)' }}
            >
              <p>
                No service providers found matching "{searchTerm}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.main>
  )
} 