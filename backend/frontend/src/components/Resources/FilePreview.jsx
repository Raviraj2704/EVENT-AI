import React from 'react';

export const FilePreview = ({ resource }) => {
  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      ppt: '🎨',
      xls: '📊',
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      archive: '📦',
      other: '📎'
    };
    return icons[type] || icons.other;
  };

  const getPreview = () => {
    if (resource.file_type === 'image') {
      return (
        <img
          src={resource.file_url}
          alt={resource.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      );
    }

    if (resource.file_type === 'video') {
      return (
        <div className="bg-gray-900 rounded-lg h-48 flex items-center justify-center">
          <span className="text-6xl">🎬</span>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg h-48 flex items-center justify-center">
        <span className="text-6xl">{getFileIcon(resource.file_type)}</span>
      </div>
    );
  };

  return <div className="mb-4">{getPreview()}</div>;
};

export default FilePreview;