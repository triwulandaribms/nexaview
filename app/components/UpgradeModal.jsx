'use client'
import React from 'react'
import { X, Check } from 'lucide-react'

const UpgradeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const plans = [
    {
      name: "Free",
      price: "$5",
      period: "",
      description: "Designed for individuals exploring and evaluating features",
      features: [
        "2,000 credits",
        "50 runs/day",
        "Build upto 7 applications",
        "Single-user access",
        "100MB storage for datasets",
        "50+ pre-built apps",
        "Tracing for debugging"
      ],
      additionalFeatures: [
        "Basic admin controls"
      ],
      buttonText: "Selected Plan",
      buttonStyle: "secondary",
      highlighted: false
    },
    {
      name: "Starter Plan",
      price: "$99",
      period: "/month",
      description: "For individuals just getting started with Agentic AI",
      features: [
        "40,000 credits per month",
        "100 runs/day",
        "Everything in Trial +",
        "Build upto 14 applications",
        "Single-user access",
        "500MB storage for datasets",
        "50+ pre-built apps"
      ],
      additionalFeatures: [
        "Integrate AI directly with SDK"
      ],
      buttonText: "Upgrade Plan",
      buttonStyle: "primary",
      highlighted: false
    },
    {
      name: "Custom Plan",
      price: "Custom",
      period: "",
      description: "For empowering entire organisations with an full stack Agentic AI platform",
      features: [
        "Custom credits per month",
        "Custom runs/day"
      ],
      additionalFeatures: [
        "Everything in Scale-up +",
        "Enterprise essentials",
        "Flexible deployment options - Customer Cloud, On-premise",
        "Advanced Compliance (SOC2 Type 2, ISO), Data Isolation",
        "Bring your own AI models"
      ],
      buttonText: "Request demo",
      buttonStyle: "custom",
      highlighted: true
    }
  ]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        style={{ 
          background: 'rgba(0, 0, 0, 0.4)',
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Upgrade Plan
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-all duration-200 hover:scale-110"
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
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 h-full flex flex-col ${
                  plan.highlighted ? 'relative overflow-hidden' : ''
                }`}
                style={{
                  background: plan.highlighted 
                    ? 'var(--sidebar-active-bg)' 
                    : 'var(--surface-secondary)',
                  border: '1px solid var(--border-light)',
                }}
              >
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ 
                      color: plan.highlighted ? 'var(--text-inverse)' : 'var(--text-primary)' 
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ 
                      color: plan.highlighted ? 'var(--text-inverse)' : 'var(--text-secondary)' 
                    }}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline">
                    <span 
                      className="text-3xl font-bold"
                      style={{ 
                        color: plan.highlighted ? 'var(--text-inverse)' : 'var(--text-primary)' 
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span 
                        className="text-sm ml-1"
                        style={{ 
                          color: plan.highlighted ? 'var(--text-inverse)' : 'var(--text-secondary)' 
                        }}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 mb-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check 
                            className="h-4 w-4" 
                            style={{ 
                              color: plan.highlighted ? 'var(--text-inverse)' : 'var(--primary)' 
                            }} 
                          />
                        </div>
                        <span 
                          className="text-sm"
                          style={{ 
                            color: plan.highlighted ? 'var(--text-inverse)' : 'var(--text-secondary)' 
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Additional Features */}
                  {plan.additionalFeatures.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {plan.additionalFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check 
                              className="h-4 w-4" 
                              style={{ 
                                color: plan.highlighted ? 'var(--text-inverse)' : 'var(--primary)' 
                              }} 
                            />
                          </div>
                          <span 
                            className="text-sm"
                            style={{ 
                              color: plan.highlighted ? 'var(--text-inverse)' : 'var(--text-secondary)' 
                            }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-4 rounded-md font-semibold transition-all duration-200 hover:scale-105  ${
                    plan.buttonStyle === 'secondary ' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{
                    background: plan.buttonStyle === 'secondary' 
                      ? 'var(--surface-tertiary)' 
                      : plan.highlighted 
                        ? 'var(--text-inverse)' 
                        : 'var(--sidebar-active-bg)',
                    color: plan.buttonStyle === 'secondary' 
                      ? 'var(--text-secondary)' 
                      : plan.highlighted 
                        ? 'var(--primary)' 
                        : 'var(--text-inverse)',
                  }}
                  disabled={plan.buttonStyle === 'secondary'}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal 