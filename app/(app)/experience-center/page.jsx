'use client'
import React, { useState } from 'react'
import { Search, ExternalLink, BookOpen, ChevronRight, Play, Bot, Wrench, Database } from 'lucide-react'

export default function ExperienceCenter() {
  const [activeFilter, setActiveFilter] = useState('All')

  const conversationalAgents = [
    {
      id: 1,
      title: "Resume and Candidate Match Evaluation",
      description: "Analyzes resume against a job description, comparing key qualifications, skills, and experience to provide a match score.",
      type: "Agent",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Credit Analyst AI Agent",
      description: "Credit Analyst AI Agent to automates financial data extraction, analysis, and report generation, helping analysts quickly retrieve key insights, minimize error...",
      type: "Agent",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "Data Analyst Agent",
      description: "An agent that can answer questions by running SQL queries over a database.",
      type: "Agent",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ]

  const processAutomations = [
    {
      id: 1,
      title: "Document Structurer",
      description: "Convert any document into a structured file, extracting key information and formatting it into structured outputs like JSON, Markdown, or other machine-readable formats.",
      type: "Tool",
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    {
      id: 2,
      title: "PDF Structurer",
      description: "A tool to convert a PDF file into a structured format, extracting key information and transforming it into machine-readable outputs like JSON, Markdown, or...",
      type: "Tool",
      bgColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    },
    {
      id: 3,
      title: "KYC Verification Automation",
      description: "Automate identity verification and compliance checks with AI-powered KYC processing.",
      type: "Tool",
      bgColor: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    }
  ]

  return (
    <main 
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto"
      style={{ background: 'var(--background)' }}
    >
      <div className="">
        {/* Hero Section */}
        <div className="mb-12 lg:mb-16 p-6 rounded-md" style={{ background: 'var(--primary)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-white">
                Welcome to Experience Center
              </h1>
              <p className="text-white opacity-90">
                Begin your new app project by leveraging any of the AI-powered products available. You have the flexibility to integrate additional products into your app at any point in your app journey.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 border hover:bg-surface-hover"
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-medium)'
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Request Demo
              </button>
            </div>
          </div>
        </div>

        {/* Conversational Agents Section */}
        <div className="mb-12 lg:mb-16">
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Conversational Agents
            </h2>
            <p 
              className=""
              style={{ color: 'var(--text-secondary)' }}
            >
              AI agents that engage in natural conversations and automate complex workflows with intelligent decision-making capabilities.
            </p>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {conversationalAgents.map((agent) => (
              <div 
                key={agent.id}
                className="rounded-md border overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Card Image/Header */}
                <div 
                  className="h-48 relative flex items-center justify-center"
                  style={{ background: agent.bgColor }}
                >
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {agent.type}
                  </div>
                  <div className="text-white text-6xl opacity-20">
                    <Bot />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 
                      className="font-bold text-lg mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {agent.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {agent.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button 
                      className="px-6 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer hover:scale-105"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      Try Now
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-surface-tertiary hover:text-primary"
                        style={{
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Play className="h-4 w-4" style={{ color: '#ff0000' }} />
                      </button>
                      
                      <button 
                        className="p-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-surface-tertiary hover:text-primary"
                        style={{
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agentic Process Automations Section */}
        <div>
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Agentic Process Automations
            </h2>
            <p 
              className=""
              style={{ color: 'var(--text-secondary)' }}
            >
              Streamline complex business processes with intelligent automation tools that adapt and learn from your workflows.
            </p>
          </div>

          {/* Automation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {processAutomations.map((automation) => (
              <div 
                key={automation.id}
                className="rounded-md border overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Card Image/Header */}
                <div 
                  className="h-48 relative flex items-center justify-center"
                  style={{ background: automation.bgColor }}
                >
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {automation.type}
                  </div>
                  <div className="text-white text-6xl opacity-20">
                    <Wrench />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 
                      className="font-bold text-lg mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {automation.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {automation.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button 
                      className="px-6 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer hover:scale-105"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      Try Now
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-surface-tertiary hover:text-primary"
                        style={{
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Play className="h-4 w-4" style={{ color: '#ff0000' }} />
                      </button>
                      
                      <button 
                        className="p-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-surface-tertiary hover:text-primary"
                        style={{
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 