'use client'
import React, { useState } from 'react'
import { Search, Plus, Download, List, Grid3X3, MoreHorizontal } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import CreateToolModal from '../../components/CreateToolModal'
import ToolDetailsModal from '../../components/ToolDetailsModal'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tools() {
  const [activeTab, setActiveTab] = useState('My tools')
  const [viewMode, setViewMode] = useState('list')
  const [isCreateToolModalOpen, setIsCreateToolModalOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)
  const [isToolDetailsModalOpen, setIsToolDetailsModalOpen] = useState(false)

  const handleToolClick = (tool) => {
    setSelectedTool(tool)
    setIsToolDetailsModalOpen(true)
  }

  const tabs = [
    'My tools',
    'Tool templates', 
    'Favourite tools'
  ]

  const tools = [
    {
      id: 1,
      name: 'PDF to Markdown',
      description: 'A tool to convert a PDF file into ...',
      type: 'Basic',
      categories: '--',
      createdAt: '04-06-2025 | 08:25 PM',
      lastEdited: '04-06-2025 | 08:25PM'
    },
    {
      id: 2,
      name: 'PDF to Text',
      description: 'A tool to convert PDF file to text',
      type: 'Basic',
      categories: 'Document Processing',
      createdAt: '04-06-2025 | 08:25 PM',
      lastEdited: '04-06-2025 | 08:25PM'
    },
    {
      id: 3,
      name: 'Google Search Tool',
      description: 'The name of the topic on which the t...',
      type: 'Basic',
      categories: '--',
      createdAt: '04-06-2025 | 08:25 PM',
      lastEdited: '04-06-2025 | 08:25PM'
    },
    {
      id: 4,
      name: 'Web Researcher Tool',
      description: 'The name of the topic on which the t...',
      type: 'Basic',
      categories: '--',
      createdAt: '04-06-2025 | 08:25 PM',
      lastEdited: '04-06-2025 | 08:25PM'
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
        {/* Header */}
        <div>
          <PageHeader 
            title="Tools"
            subtitle="Advance your LLM development process with robust tools designed for scaling from initial demos to full-scale production."
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
              placeholder="Search tool"
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
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium cursor-pointer"
              style={{
                background: 'var(--primary)',
                color: 'var(--text-inverse)'
              }}
              onClick={() => setIsCreateToolModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Tool
            </motion.button>
            
            <motion.label 
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium cursor-pointer border"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-light)'
              }}
            >
              <input type="file" className="hidden" />
              <Download className="h-4 w-4" />
              Import tool
            </motion.label>

            {/* View Mode Buttons */}
            <motion.div 
              className="flex items-center rounded-md border overflow-hidden" 
              style={{ borderColor: 'var(--border-light)' }}
            >
              <motion.button
                className="p-3 cursor-pointer"
                style={{
                  background: viewMode === 'list' ? 'var(--primary)' : 'var(--surface-elevated)',
                  color: viewMode === 'list' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                }}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </motion.button>
              <motion.button
                className="p-3 cursor-pointer border-l"
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

        {/* Tools Content */}
        {activeTab === 'My tools' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* List View */}
            {viewMode === 'list' && (
              <>
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
                      <div>Tool Name</div>
                      <div className="col-span-2">Description</div>
                      <div>Tool type</div>
                      <div>Tool categories</div>
                      <div>Created At</div>
                      <div>Last edited at</div>
                    </div>

                    {/* Table Body */}
                    {tools.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-surface-hover cursor-pointer"
                        style={{ borderColor: 'var(--border-light)' }}
                        onClick={() => handleToolClick(tool)}
                      >
                        <div className="font-medium">{tool.name}</div>
                        <div className="col-span-2 text-sm">{tool.description}</div>
                        <div className="text-sm">{tool.type}</div>
                        <div className="text-sm">{tool.categories}</div>
                        <div className="text-sm">{tool.createdAt}</div>
                        <div className="text-sm">{tool.lastEdited}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden space-y-4">
                  {tools.map((tool, index) => (
                    <div 
                      key={tool.id}
                      className="rounded-md border p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                      style={{
                        background: 'var(--surface-elevated)',
                        borderColor: 'var(--border-light)'
                      }}
                      onClick={() => handleToolClick(tool)}
                    >
                      {/* Tool Name and Actions */}
                      <div className="flex items-center justify-between mb-3">
                        <div 
                          className="font-medium text-lg"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {tool.name}
                        </div>
                        <button 
                          className="p-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-surface-tertiary"
                          style={{
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Tool Details */}
                      <div className="space-y-3">
                        <div>
                          <span 
                            className="text-xs font-medium uppercase tracking-wide block mb-1"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            Description
                          </span>
                          <span 
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {tool.description}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span 
                              className="text-xs font-medium uppercase tracking-wide block mb-1"
                              style={{ color: 'var(--text-tertiary)' }}
                            >
                              Type
                            </span>
                            <span 
                              className="text-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {tool.type}
                            </span>
                          </div>
                          <div>
                            <span 
                              className="text-xs font-medium uppercase tracking-wide block mb-1"
                              style={{ color: 'var(--text-tertiary)' }}
                            >
                              Categories
                            </span>
                            <span 
                              className="text-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {tool.categories}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span 
                            className="text-xs font-medium uppercase tracking-wide block mb-1"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            Created At
                          </span>
                          <span 
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {tool.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-md border p-6 cursor-pointer hover:shadow-md transition-all duration-200 group"
                    style={{
                      background: 'var(--surface-elevated)',
                      borderColor: 'var(--border-light)'
                    }}
                    onClick={() => handleToolClick(tool)}
                    whileHover={{ y: -4, }}
                  >
                    {/* Tool Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-lg mb-2 group-hover:text-[var(--primary)] transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {tool.name}
                        </h3>
                        <span 
                          className="text-xs px-2 py-1 rounded-md font-medium"
                          style={{ 
                            background: 'var(--primary-light)', 
                            color: 'var(--primary)' 
                          }}
                        >
                          {tool.type}
                        </span>
                      </div>
                      <motion.button 
                        className="p-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                        style={{
                          color: 'var(--text-secondary)',
                          background: 'var(--surface-secondary)'
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Tool Description */}
                    <p 
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {tool.description}
                    </p>

                    {/* Tool Categories */}
                    <div className="mb-4">
                      <span 
                        className="text-xs font-medium uppercase tracking-wide block mb-2"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Categories
                      </span>
                      <span 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {tool.categories}
                      </span>
                    </div>

                    {/* Tool Footer */}
                    <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          Created: {tool.createdAt.split(' | ')[0]}
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          Edited: {tool.lastEdited.split(' | ')[0]}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Tool Templates Tab */}
        {activeTab === 'Tool templates' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* List View */}
            {viewMode === 'list' && (
              <>
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
                      <div>Template Name</div>
                      <div className="col-span-2">Description</div>
                      <div>Tool type</div>
                      <div>Tool categories</div>
                      <div>Downloads</div>
                      <div>Rating</div>
                    </div>

                    {/* Empty State */}
                    <div className="p-12 text-center">
                      <div 
                        className="text-4xl mb-4"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        📋
                      </div>
                      <h3 
                        className="text-lg font-medium mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        No Tool Templates Available
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Pre-built tool templates will be displayed here when available
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden">
                  <div className="p-12 text-center rounded-md border" style={{
                    background: 'var(--surface-elevated)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <div 
                      className="text-4xl mb-4"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      📋
                    </div>
                    <h3 
                      className="text-lg font-medium mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      No Tool Templates Available
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Pre-built tool templates will be displayed here when available
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Empty State for Grid */}
                <div className="col-span-full p-12 text-center rounded-md border" style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)'
                }}>
                  <div 
                    className="text-4xl mb-4"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    📋
                  </div>
                  <h3 
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    No Tool Templates Available
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Pre-built tool templates will be displayed here when available
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Favourite Tools Tab */}
        {activeTab === 'Favourite tools' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* List View */}
            {viewMode === 'list' && (
              <>
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
                      <div>Tool Name</div>
                      <div className="col-span-2">Description</div>
                      <div>Tool type</div>
                      <div>Tool categories</div>
                      <div>Added to Favourites</div>
                      <div>Last used</div>
                    </div>

                    {/* Empty State */}
                    <div className="p-12 text-center">
                      <div 
                        className="text-4xl mb-4"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        ⭐
                      </div>
                      <h3 
                        className="text-lg font-medium mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        No Favourite Tools Yet
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Tools you mark as favourites will appear here for quick access
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden">
                  <div className="p-12 text-center rounded-md border" style={{
                    background: 'var(--surface-elevated)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <div 
                      className="text-4xl mb-4"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      ⭐
                    </div>
                    <h3 
                      className="text-lg font-medium mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      No Favourite Tools Yet
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Tools you mark as favourites will appear here for quick access
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Empty State for Grid */}
                <div className="col-span-full p-12 text-center rounded-md border" style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)'
                }}>
                  <div 
                    className="text-4xl mb-4"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    ⭐
                  </div>
                  <h3 
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    No Favourite Tools Yet
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Tools you mark as favourites will appear here for quick access
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Create Tool Modal */}
        <AnimatePresence>
          {isCreateToolModalOpen && (
            <CreateToolModal
              isOpen={isCreateToolModalOpen}
              onClose={() => setIsCreateToolModalOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Tool Details Modal */}
        <AnimatePresence>
          {isToolDetailsModalOpen && (
            <ToolDetailsModal
              isOpen={isToolDetailsModalOpen}
              onClose={() => setIsToolDetailsModalOpen(false)}
              tool={selectedTool}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.main>
  )
} 