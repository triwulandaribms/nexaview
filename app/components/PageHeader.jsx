import React from 'react'

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 
        className="text-2xl font-bold mb-1 max-md:text-xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p 
          className="max-md:text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageHeader 