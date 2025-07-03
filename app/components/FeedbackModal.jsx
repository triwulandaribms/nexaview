'use client'
import React, { useState } from 'react'
import { X, Star } from 'lucide-react'

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle feedback submission here
    console.log('Feedback submitted:', { feedback, rating })
    // Reset form and close modal
    setFeedback('')
    setRating(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)' 
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-lg rounded-2xl p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300"
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: 'var(--surface-secondary)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--surface-tertiary)'
            e.target.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--surface-secondary)'
            e.target.style.color = 'var(--text-secondary)'
          }}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Illustration */}
        <div className="text-center mb-6">
          <div 
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--primary-light)',
            }}
          >
            <div 
              className="text-3xl font-bold"
              style={{ color: 'var(--primary)' }}
            >
              💭
            </div>
          </div>
          
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            We Value Your Insights!
          </h2>
          
          <p 
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Thank you for exploring NextDocs. We'd love to hear about your experience. Your 
            feedback helps us refine and enhance our platform to better serve you.
          </p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Text */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              We value your feedback! Please share your thoughts to help us enhance your experience.
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)',
                focusRingColor: 'var(--primary)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)'
                e.target.style.boxShadow = '0 0 0 2px var(--primary-light)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-light)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Rating */}
          <div>
            <label 
              className="block text-sm font-medium mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              How easy was it for you to use NextDocs?
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 transition-colors duration-200 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span 
                  className="ml-2 text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            style={{
              background: 'var(--sidebar-active-bg)',
              color: 'var(--text-inverse)',
            }}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal 