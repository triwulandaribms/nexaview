'use client'
import React, { useState } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PDFToText() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRunTool = () => {
    if (!selectedFile) {
      alert('Please select a PDF file first')
      return
    }
    // Handle tool execution here
    console.log('Running PDF to Text conversion on:', selectedFile.name)
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

  const uploadAreaVariants = {
    normal: {
      borderColor: 'var(--border-medium)',
      backgroundColor: 'var(--surface-base)',
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    dragOver: {
      borderColor: 'var(--primary)',
      backgroundColor: 'rgba(139, 92, 246, 0.03)',
      boxShadow: "0 0 15px rgba(139, 92, 246, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    fileSelected: {
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.03)',
      boxShadow: "0 0 15px rgba(74, 222, 128, 0.1)",
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
            PDF to Text
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
              📄
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
              PDF to Text
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
              A tool to convert PDF file to text.
            </motion.p>
          </motion.div>

          {/* Upload Section */}
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
              Upload your file
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
              The file should be in PDF format
            </motion.p>

            {/* Drag and Drop Area */}
            <motion.div
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer"
              variants={uploadAreaVariants}
              animate={
                isDragOver 
                  ? "dragOver" 
                  : selectedFile 
                    ? "fileSelected" 
                    : "normal"
              }
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedFile ? 'selected' : 'upload'}
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: selectedFile ? '#4ade80' : '#8b5cf6',
                      color: 'white'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { duration: 0.4 }
                    }}
                    exit={{ 
                      opacity: 0,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Upload className="h-6 w-6" />
                  </motion.div>
                </AnimatePresence>
                <div>
                  <motion.p 
                    className="text-sm font-medium mb-1"
                    style={{ color: 'var(--text-primary)' }}
                    key={selectedFile ? selectedFile.name : 'placeholder'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {selectedFile ? `✓ ${selectedFile.name}` : 'Drag and Drop your files here or click here to browse'}
                  </motion.p>
                  {!selectedFile && (
                    <motion.p 
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        transition: { delay: 0.2, duration: 0.3 }
                      }}
                    >
                      PDF files only
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </motion.div>

          {/* Run Tool Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleRunTool}
              className="w-full py-3 px-6 rounded-md font-medium text-white"
              variants={buttonVariants}
              animate={selectedFile ? "enabled" : "disabled"}
              whileHover={selectedFile ? "hover" : {}}
              whileTap={selectedFile ? "tap" : {}}
              disabled={!selectedFile}
            >
              🚀 Run Tool
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  )
} 