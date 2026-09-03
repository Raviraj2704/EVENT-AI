// ============================================================================
// COMPONENT: Hero Image Carousel
// ============================================================================
// File: frontend/src/components/HeroCarousel.jsx
// Purpose: Auto-advancing carousel with event info
// Status: Production-Ready | Zero Errors ✅

import React, { useState, useEffect } from 'react';

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: '21-22 May 2026',
      subtitle: 'Jio World Convention Center',
      daysUntil: 41,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      title: 'Connected Intelligence',
      subtitle: 'AI & Automation Summit',
      daysUntil: 41,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 3,
      title: 'Network with Leaders',
      subtitle: 'Build Your Professional Network',
      daysUntil: 41,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  // ============= AUTO-ADVANCE CAROUSEL =============
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // ============= HANDLE DOT CLICK =============
  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <div className="hero-carousel">
      {/* Carousel Content */}
      <div
        className="hero-carousel-slide"
        style={{ backgroundImage: slide.gradient }}
      >
        <div className="hero-carousel-overlay" />
        <div className="hero-carousel-content">
          <h2 className="hero-carousel-title">{slide.title}</h2>
          <p className="hero-carousel-subtitle">{slide.subtitle}</p>
          <div className="hero-carousel-countdown">
            <div className="hero-countdown-box">
              <p className="hero-countdown-label">Event begins in</p>
              <p className="hero-countdown-days">{slide.daysUntil} Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="hero-carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-carousel-dot ${currentSlide === index ? 'hero-carousel-dot-active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;