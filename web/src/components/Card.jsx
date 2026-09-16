'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Card({ title, description, icon, items, onClick }) {
  return (
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)';
      e.currentTarget.style.transform = 'translateY(-5px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Icon */}
      <div style={{
        marginBottom: '1.5rem'
      }}>
        {icon}
      </div>
      
      {/* Title */}
      <h2 style={{
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        fontWeight: '400',
        marginBottom: '1rem',
        color: 'white',
        letterSpacing: '0.05em'
      }}>
        {title}
      </h2>
      
      {/* Description */}
      <p style={{
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '2rem',
        lineHeight: 1.6,
        fontSize: '0.9rem'
      }}>
        {description}
      </p>
      
      {/* Items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        {items.map((item) => (
          <div key={item} style={{
            padding: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.9)'
          }}>
            {item}
          </div>
        ))}
      </div>
      
      {/* Button */}
      <button 
        onClick={onClick}
        style={{
          marginTop: 'auto',
          backgroundColor: 'transparent',
          border: '1px solid white',
          color: 'white',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.05em'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.color = 'black';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'white';
        }}
      >
        Begin Journey <ArrowRight size={16} />
      </button>
    </div>
  );
}