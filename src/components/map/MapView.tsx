'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FootballField } from '@/lib/types';
import FieldMarker from './FieldMarker';
import FieldDetails from './FieldDetails';

interface MapViewProps {
  fields: FootballField[];
  selectedField: FootballField | null;
  onFieldSelect: (fieldId: string) => void;
  onFieldDeselect: () => void;
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
}

export default function MapView({
  fields,
  selectedField,
  onFieldSelect,
  onFieldDeselect,
  center,
  zoom,
  className
}: MapViewProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mapReady) {
    return (
      <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-green-50 to-green-100 rounded-lg overflow-hidden ${className}`}>
      {/* Mock Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ceb3f7f5-57b3-427f-b270-277759a040a5.png')`
        }}
      />
      
      {/* Map Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Button size="sm" variant="outline" className="bg-white shadow-lg">
          +
        </Button>
        <Button size="sm" variant="outline" className="bg-white shadow-lg">
          −
        </Button>
        <Button size="sm" variant="outline" className="bg-white shadow-lg">
          📍
        </Button>
      </div>

      {/* Center Info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-sm font-medium text-gray-800">
          São Paulo, SP
        </p>
        <p className="text-xs text-gray-600">
          {fields.length} campos encontrados
        </p>
        <p className="text-xs text-gray-500">
          Zoom: {zoom} | Centro: {center.lat.toFixed(3)}, {center.lng.toFixed(3)}
        </p>
      </div>

      {/* Field Markers */}
      <div className="absolute inset-0">
        {fields.map((field, index) => {
          // Calculate position based on coordinates (mock positioning)
          const x = ((field.coordinates.lng + 46.8) * 2000) % 90;
          const y = ((field.coordinates.lat + 23.8) * 2000) % 85;
          
          return (
            <FieldMarker
              key={field.id}
              field={field}
              isSelected={selectedField?.id === field.id}
              onClick={() => onFieldSelect(field.id)}
              style={{
                left: `${Math.max(5, Math.min(85, x))}%`,
                top: `${Math.max(5, Math.min(80, y))}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
          );
        })}
      </div>

      {/* Selected Field Details */}
      {selectedField && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <FieldDetails
            field={selectedField}
            onClose={onFieldDeselect}
          />
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-medium mb-2">Legenda</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Disponível</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">Ocupado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs">Selecionado</span>
          </div>
        </div>
      </div>

      {/* No Fields Message */}
      {fields.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="max-w-sm mx-4">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-xl">🏟️</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Nenhum campo encontrado</h3>
              <p className="text-sm text-gray-600">
                Ajuste seus filtros ou tente uma busca diferente.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}