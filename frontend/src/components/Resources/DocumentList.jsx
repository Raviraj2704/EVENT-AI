import React from 'react';
import DocumentCard from './DocumentCard';

export const DocumentList = ({
  resources,
  briefcaseItems,
  onSaveBriefcase,
  onRemoveBriefcase,
  onDownload,
  loading
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <p className="text-gray-600 dark:text-gray-400">No resources found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => {
        const isSaved = briefcaseItems.some((item) => item.briefcase?.resource_id === resource.id || item.resource?.id === resource.id);
        return (
          <DocumentCard
            key={resource.id}
            resource={resource}
            isSaved={isSaved}
            onSaveBriefcase={() => onSaveBriefcase(resource.id)}
            onRemoveBriefcase={() => onRemoveBriefcase(resource.id)}
            onDownload={onDownload}
          />
        );
      })}
    </div>
  );
};

export default DocumentList;