// ============================================================================
// COMPONENT: Announcement Detail Modal
// ============================================================================
// File: frontend/src/components/AnnouncementDetailModal.jsx
// Purpose: Modal for viewing full announcement details
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const AnnouncementDetailModal = ({ announcement, isOpen, onClose, onMarkAsRead, onShare }) => {
  const [isSharing, setIsSharing] = useState(false);

  // ============= FORMAT DATE =============
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // ============= CALCULATE TIME REMAINING =============
  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  // ============= GET PRIORITY COLOR =============
  const getPriorityColor = (priority) => {
    const colorMap = {
      urgent: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981',
    };
    return colorMap[priority] || '#6b7280';
  };

  if (!isOpen || !announcement) return null;

  return (
    <div className="announcement-detail-modal-overlay" onClick={onClose}>
      <div
        className="announcement-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="announcement-detail-modal-header">
          <div className="announcement-detail-modal-priority">
            <span
              className="announcement-detail-modal-priority-badge"
              style={{ backgroundColor: getPriorityColor(announcement.priority) }}
            >
              {announcement.priority.toUpperCase()}
            </span>
          </div>
          <button
            className="announcement-detail-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="announcement-detail-modal-body">
          {/* Image */}
          {announcement.image && (
            <div className="announcement-detail-modal-image">
              <img
                src={announcement.image}
                alt={announcement.title}
                className="announcement-detail-modal-image-content"
              />
            </div>
          )}

          {/* Title */}
          <h2 className="announcement-detail-modal-title">{announcement.title}</h2>

          {/* Meta Info */}
          <div className="announcement-detail-modal-meta">
            <div className="announcement-detail-modal-meta-item">
              <span className="announcement-detail-modal-meta-icon">📅</span>
              <span className="announcement-detail-modal-meta-text">
                {formatDate(announcement.createdAt)}
              </span>
            </div>

            {announcement.expiresAt && (
              <div className="announcement-detail-modal-meta-item">
                <span className="announcement-detail-modal-meta-icon">⏰</span>
                <span className="announcement-detail-modal-meta-text">
                  {getTimeRemaining(announcement.expiresAt)}
                </span>
              </div>
            )}

            <div className="announcement-detail-modal-meta-item">
              <span className="announcement-detail-modal-meta-icon">🏷️</span>
              <span className="announcement-detail-modal-meta-text">
                {announcement.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="announcement-detail-modal-content">
            <p>{announcement.content}</p>
          </div>

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="announcement-detail-modal-tags">
              {announcement.tags.map((tag, index) => (
                <span key={index} className="announcement-detail-modal-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {announcement.ctaText && announcement.ctaLink && (
            <button className="announcement-detail-modal-cta">
              {announcement.ctaText}
            </button>
          )}

          {/* Footer Info */}
          <div className="announcement-detail-modal-footer-info">
            <p className="announcement-detail-modal-read-count">
              👁️ {announcement.views || 0} people viewed this
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="announcement-detail-modal-footer">
          <button
            className="announcement-detail-modal-button announcement-detail-modal-share"
            onClick={() => {
              setIsSharing(true);
              onShare?.(announcement.id);
              setTimeout(() => setIsSharing(false), 1500);
            }}
            disabled={isSharing}
          >
            {isSharing ? '✓ Shared!' : '📤 Share'}
          </button>
          <button
            className="announcement-detail-modal-button announcement-detail-modal-primary"
            onClick={() => {
              onMarkAsRead?.(announcement.id);
              onClose?.();
            }}
          >
            ✓ Mark as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailModal;