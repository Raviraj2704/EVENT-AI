import React from 'react';
import PartnerCard from './PartnerCard';

export const PartnersGrid = ({ partners, searchTerm, partnerType, onInteract }) => {
  // Filter by search term and tier
  const filteredPartners = partners.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = partnerType === 'all' || p.partner_type === partnerType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      {filteredPartners.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No partners found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <PartnerCard 
              key={partner.id} 
              partner={partner} 
              onInteract={onInteract} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnersGrid;