'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FootballField } from '@/lib/types';

interface FieldMarkerProps {
  field: FootballField;
  isSelected: boolean;
  onClick: () => void;
  style: React.CSSProperties;
}

export default function FieldMarker({ field, isSelected, onClick, style }: FieldMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getMarkerColor = () => {
    if (isSelected) return 'bg-blue-500 border-blue-600';
    if (!field.isOpen) return 'bg-gray-500 border-gray-600';
    if (field.availability.some(slot => slot.isAvailable)) return 'bg-green-500 border-green-600';
    return 'bg-red-500 border-red-600';
  };

  const getMarkerSize = () => {
    if (isSelected) return 'w-8 h-8';
    return 'w-6 h-6';
  };

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
      style={style}
    >
      {/* Marker */}
      <Button
        variant="ghost"
        size="sm"
        className={`
          relative p-0 rounded-full border-2 transition-all duration-300 hover:scale-110 shadow-lg
          ${getMarkerColor()} ${getMarkerSize()}
        `}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="text-white text-xs font-bold">⚽</span>
        
        {/* Pulse animation for available fields */}
        {field.isOpen && field.availability.some(slot => slot.isAvailable) && (
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        )}
      </Button>

      {/* Hover tooltip */}
      {(isHovered || isSelected) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl border p-3 min-w-64 max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-800 text-sm leading-tight">{field.name}</h4>
              {field.isVerified && (
                <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                  ✓
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{field.address}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="text-sm font-medium">{field.rating}</span>
                <span className="text-xs text-gray-500">({field.totalRatings})</span>
              </div>
              
              <div className="text-right">
                <span className="text-sm font-bold text-green-600">
                  R$ {field.price}
                </span>
                <span className="text-xs text-gray-500">/{field.priceUnit === 'hour' ? 'hora' : 'jogo'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {field.size}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {field.type}
                </Badge>
              </div>
              
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${field.isOpen && field.availability.some(slot => slot.isAvailable)
                  ? 'bg-green-100 text-green-700'
                  : field.isOpen
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }
              `}>
                {field.isOpen 
                  ? field.availability.some(slot => slot.isAvailable)
                    ? 'Disponível'
                    : 'Ocupado'
                  : 'Fechado'
                }
              </div>
            </div>

            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200 -mt-px" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}