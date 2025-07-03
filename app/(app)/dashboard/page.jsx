'use client'
import React from 'react'
import { Play, BookOpen, Database, Brain, Wrench, Bot, ExternalLink, HelpCircle, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const workflowSteps = [
    {
      number: 1,
      title: "Create a Dataset",
      href: "/dataset",
      description: "Upload your files or connect to data sources to create a dataset"
    },
    {
      number: 2,
      href: "/knowledge-base",
      title: "Create a Knowledge Base",
      description: "Process your dataset into a searchable knowledge base"
    },
    {
      number: 3,
      href: "/tools",
      title: "Build a Tool",
      description: "Create a tool by defining inputs, adding no-code steps, and configuring outputs."
    },
    {
      number: 4,
      href: "/agents",
      title: "Build an Agent",
      description: "Create a agent that uses your knowledge base or tool"
    }
  ]

  const prebuiltResources = [
    {
      title: "UNO Rule & Web Research Agent",
      description: "An AI Agent that interprets UNO game rules and conducts web research to provide accurate and structured insights.",
      type: "Agent",
      image: "/api/placeholder/300/200",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "web_researcher_tool",
      description: "The name of the topic on which the tool will conduct research.",
      type: "Tool", 
      image: "/api/placeholder/300/200",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Uno_Rulebook",
      description: "Processing the unstructured UNO Rulebook file into a structured format for AI agents to enable accurate rule enforcement and gameplay assistance.",
      type: "Knowledge base",
      image: "/api/placeholder/300/200",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ]

  const platformComponents = [
    {
      icon: Bot,
      href: "/agents",
      title: "Agents",
      description: "Agents use LLMs to process input, make decisions, and take actions to automate workflows."
    },
    {
      icon: Wrench,
      href: "/tools",
      title: "Tools",
      description: "Automate workflows with actions like model calls, web scraping, and data processing"
    },
    {
      icon: Brain,
      href: "/ai-chain",
      title: "AI Chain",
      description: "Orchestrate multi-agent collaboration for complex, end-to-end automation."
    },
    {
      icon: Database,
      href: "/dataset",
      title: "Dataset",
      description: "Seamlessly integrate data from 300+ sources or upload files to power AI workflows."
    },
    {
      icon: Brain,
      href: "/models",
      title: "Models",
      description: "Leverage open and closed-source models optimized for various tasks."
    },
    {
      icon: BookOpen,
      href: "/knowledge-base",
      title: "Knowledge Base",
      description: "Transform enterprise data into a dynamic, AI-ready knowledge repository for RAG and intelligent search"
    }
  ]

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <div>
        {/* Welcome Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 lg:mb-12"
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">Hi, Dika Irwandifika</h1>
          <p className="ttext-xl text-[var(--text-muted)]">Design, deploy, and manage AI-driven applications customized for your specific needs.</p>
        </motion.div>

        {/* SimplAI Studio Workflow Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 lg:mb-16 p-5 rounded-md bg-primary"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl font-bold mb-2 text-white">
                SimplAI Studio Workflow
              </h2>
              <p className="text-white">
                Follow this recommended workflow to build and deploy AI applications with SimplAI Studio.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-md font-medium border hover:bg-surface-hover cursor-pointer" 
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-medium)'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="h-4 w-4" style={{ color: '#ff0000' }} />
                </motion.div>
                Watch Tutorial
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-md font-medium border hover:bg-surface-hover cursor-pointer" 
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border-medium)'
                }}
              >
                <BookOpen className="h-4 w-4" style={{ color: '#7c3aed' }} />
                Learn more
              </motion.button>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={step.href}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="block p-6 rounded-md hover:shadow-lg bg-(--sidebar-active-light) h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        whileHover={{ rotate: 12 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          background: 'var(--sidebar-active-bg)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        {step.number}
                      </motion.div>
                      <h3 className="font-bold text-lg flex-1">
                        {step.title}
                      </h3>
                    </div>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {step.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prebuilt Resources Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Prebuilt Resources
            </h2>
            <p 
              className=""
              style={{ color: 'var(--text-secondary)' }}
            >
              A set of ready-to-use resources designed to help users test, explore, and understand how to build AI-powered applications effortlessly.
            </p>
          </div>

          {/* Resource Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {prebuiltResources.map((resource, index) => (
              <motion.div 
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-md border overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <motion.div 
                  className="h-48 relative flex items-center justify-center"
                  style={{ background: resource.bgColor }}
                >
                  <motion.div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {resource.type}
                  </motion.div>
                  <motion.div 
                    className="text-white text-6xl opacity-20"
                  >
                    {resource.type === 'Agent' && <Bot />}
                    {resource.type === 'Tool' && <Wrench />}
                    {resource.type === 'Knowledge base' && <Database />}
                  </motion.div>
                </motion.div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3">
                      {resource.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {resource.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-md font-medium cursor-pointer hover:opacity-90"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      Try Now
                    </motion.button>
                    
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-md cursor-pointer hover:bg-surface-tertiary hover:text-primary"
                        style={{
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Play className="h-4 w-4" style={{ color: '#ff0000' }} />
                      </motion.button>
                      
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-md cursor-pointer hover:bg-surface-tertiary hover:text-primary"
                        style={{
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Key Components Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="my-16"
        >
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Platform Key Components
            </h2>
            <p 
              className=""
              style={{ color: 'var(--text-secondary)' }}
            >
              Core components of SimplAI Studio that enable users to create, customize, and deploy AI applications seamlessly.
            </p>
          </div>

          {/* Platform Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {platformComponents.map((component, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={component.href}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="block p-6 rounded-md border hover:shadow-lg hover:border-primary border-(--border-light) bg-(--surface-elevated) h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div 
                        className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)'
                        }}
                      >
                        <component.icon className="h-5 w-5" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 
                          className="font-bold text-lg mb-2"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {component.title}
                        </h3>
                      </div>
                    </div>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {component.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Need Help Getting Started Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-3 rounded-md border" 
          style={{
            background: 'var(--surface-elevated)',
            borderColor: 'var(--border-light)',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0 flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 12 }}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)'
                }}
              >
                <HelpCircle className="h-6 w-6" />
              </motion.div>
              <div>
                <h3 
                  className="md:text-xl font-bold md:mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Need help getting started?
                </h3>
                <p 
                  className="text-base max-md:text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Our team is available to help you set up your first AI application.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-2 rounded-md font-semibold border hover:bg-surface-hover cursor-pointer"
              >
                <FileText className="h-5 w-5" />
                View Documentation
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-2 rounded-md font-semibold hover:opacity-90 cursor-pointer bg-primary text-(--text-inverse)"
              >
                <Calendar className="h-5 w-5" />
                Book a Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
