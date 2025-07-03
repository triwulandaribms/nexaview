'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function AddUserToProjectModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black/10 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 448 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md h-full bg-[var(--surface-elevated)] rounded-s-3xl shadow-lg flex flex-col border-l border-[var(--border-light)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Add user to project</h2>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-md font-medium text-sm transition-all duration-200"
              style={{ background: 'var(--primary)', color: 'var(--text-inverse)' }}
            >
              Invite User
            </button>
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--primary)] text-2xl font-bold transition-colors"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Select users to add
            </label>
            <select className="w-full border border-[var(--border-light)] rounded-md px-3 py-2 bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
              <option value="">Select users to add</option>
              <option value="user1">John Doe (john@example.com)</option>
              <option value="user2">Jane Smith (jane@example.com)</option>
              <option value="user3">Bob Johnson (bob@example.com)</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[var(--border-light)] flex justify-end">
          <button
            className="px-6 py-2 rounded-md font-medium transition-all duration-200 bg-[var(--primary)] text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            onClick={onClose}
          >
            Add user(s)
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 