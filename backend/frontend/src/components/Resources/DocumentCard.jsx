// ============================================================================
// COMPONENT: Resource Card / Document Card (Combined & Production-Ready)
// ============================================================================
// File: frontend/src/components/Resources/DocumentCard.jsx
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';
import DownloadButton from './DownloadButton';

export const DocumentCard = ({
  resource,
  onSaveBriefcase,
  onRemoveBriefcase,
  isSaved,
  onDownload,
  onPreview,
  onShare,
  onToggleStar
}) => {
  const [isStarred, setIsStarred] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // ============= GET FILE TYPE COLOR (Gradient bar) =============
  const getFileTypeColor = (type) => {
    const colors = {
      pdf: 'from-red-500 to-red-600',
      doc: 'from-blue-500 to-blue-600',
      docx: 'from-blue-500 to-blue-600',
      ppt: 'from-orange-500 to-orange-600',
      pptx: 'from-orange-500 to-orange-600',
      xls: 'from-green-500 to-green-600',
      xlsx: 'from-green-500 to-green-600',
      image: 'from-purple-500 to-purple-600',
      video: 'from-pink-500 to-pink-600',
      audio: 'from-indigo-500 to-indigo-600',
      archive: 'from-yellow-500 to-yellow-600',
      zip: 'from-yellow-500 to-yellow-600',
      other: 'from-gray-500 to-gray-600'
    };
    const fileTypeKey = type?.toLowerCase() || 'other';
    return colors[fileTypeKey] || colors.other;
  };

  // ============= GET FILE ICON =============
  const getFileIcon = (fileType) => {
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '🎯',
      pptx: '🎯',
      zip: '🗜️',
      video: '🎬',
      image: '🖼️',
      default: '📎',
    };
    const fileTypeKey = fileType?.toLowerCase() || 'default';
    return iconMap[fileTypeKey] || iconMap.default;
  };

  // ============= GET CATEGORY ICON & LABEL =============
  const getCategoryIcon = (category) => {
    const icons = {
      presentation: '🎨',
      handout: '📝',
      guide: '📖',
      template: '📋',
      recording: '🎬',
      article: '📰',
      case_study: '📊',
      whitepaper: '📑',
      tool: '🛠️'
    };
    return icons[category?.toLowerCase()] || '📄';
  };

  // ============= FORMAT FILE SIZE =============
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return null;
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Safe variables mapping supporting both data schemas
  const fileType = resource.file_type || resource.fileType || 'other';
  const category = resource.resource_category || resource.category || 'general';
  const fileSizeFormatted = resource.fileSize ? formatFileSize(resource.fileSize) : null;
  const authorName = resource.speaker_name || resource.uploader_name || resource.author;
  const publishedDate = resource.created_at || resource.publishedDate;
  const downloadsCount = resource.downloads_count ?? resource.downloads ?? 0;
  const viewsCount = resource.views_count ?? resource.views ?? 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between relative">
      <div>
        {/* Header with type gradient bar */}
        <div className={`bg-gradient-to-r ${getFileTypeColor(fileType)} h-3`} />

        <div className="p-6">
          {/* Top Bar: Category / Menu Button */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                <span>{getCategoryIcon(category)}</span> 
                <span>{category?.replace('_', ' ').toUpperCase()}</span>
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {resource.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {resource.is_featured && (
                <span className="text-xl">⭐</span>
              )}
              {/* Optional Three-Dot Menu for Sharing */}
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
                onClick={() => setShowShareMenu(!showShareMenu)}
                aria-label="More options"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {resource.description}
            </p>
          )}

          {/* Metadata */}
          <div className="space-y-1 mb-4 text-xs text-gray-600 dark:text-gray-400">
            {authorName && <p>🎤 {authorName}</p>}
            {publishedDate && <p>📅 {new Date(publishedDate).toLocaleDateString()}</p>}
            {fileSizeFormatted && <p>💾 {fileSizeFormatted}</p>}
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4 text-xs mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-300">
            <span>📥 {downloadsCount} downloads</span>
            {viewsCount > 0 && <span>👁️ {viewsCount} views</span>}
            {resource.rating && <span>⭐ {resource.rating}/5</span>}
          </div>

          {/* Tags */}
          {resource.tags && (
            <div className="flex gap-2 flex-wrap mb-4">
              {(Array.isArray(resource.tags) 
                ? resource.tags 
                : resource.tags.split(',')
              ).slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                >
                  {typeof tag === 'string' ? tag.trim() : tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-6 pt-0 flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          {resource.previewUrl && onPreview && (
            <button
              onClick={() => onPreview(resource.id)}
              className="px-3 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1"
            >
              👁️ Preview
            </button>
          )}
          <DownloadButton resource={resource} onDownload={onDownload} />
        </div>

        <div className="flex gap-2">
          {/* Star Button */}
          <button
            onClick={() => {
            setIsStarred(!isStarred);
            if (onToggleStar) onToggleStar();
          }}
          className={`p-2 rounded-lg transition-all ${
              isStarred
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-yellow-600'
            }`}
            title="Star this resource"
          >
            {isStarred ? '⭐' : '☆'}
          </button>

          {/* Briefcase Save / Remove Toggle */}
          {isSaved ? (
            <button
              onClick={onRemoveBriefcase}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition-all"
              title="Remove from briefcase"
            >
              🗑️
            </button>
          ) : (
            <button
              onClick={onSaveBriefcase}
              className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 transition-all"
              title="Add to briefcase"
            >
              💾
            </button>
          )}
        </div>
      </div>

      {/* Share Menu Popup */}
      {showShareMenu && (
        <div className="absolute right-4 top-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 py-1 w-44 text-sm">
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2" 
            onClick={() => { setShowShareMenu(false); onShare?.(resource.id, 'email'); }}
          >
            📧 Share via Email
          </button>
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2" 
            onClick={() => { setShowShareMenu(false); onShare?.(resource.id, 'link'); }}
          >
            🔗 Copy Link
          </button>
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2" 
            onClick={() => { setShowShareMenu(false); onShare?.(resource.id, 'bookmark'); }}
          >
            🔖 Bookmark
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;