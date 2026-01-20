
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div 
      onClick={() => onClick(property.id)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-slate-100 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.images[0] || 'https://picsum.photos/400/300'} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-emerald-600">
          {property.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{property.title}</h3>
        <p className="text-slate-500 text-sm flex items-center mt-1">
          <span className="mr-1">📍</span> {property.location}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-bold text-indigo-600">
            ₦{property.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/year</span>
          </p>
          <button className="bg-slate-100 p-2 rounded-full hover:bg-indigo-50 transition-colors">
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
