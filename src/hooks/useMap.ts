'use client';

import { useState, useEffect } from 'react';
import { FootballField, MapFilter, ViewMode } from '@/lib/types';
import { api } from '@/lib/api';

export const useMap = () => {
  const [fields, setFields] = useState<FootballField[]>([]);
  const [selectedField, setSelectedField] = useState<FootballField | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 });
  const [mapZoom, setMapZoom] = useState(12);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFields();
      setFields(data);
    } catch (err) {
      setError('Erro ao carregar campos de futebol');
      console.error('Error loading fields:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchFields = async (query: string) => {
    if (!query.trim()) {
      await loadFields();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.searchFields(query);
      setFields(data);
    } catch (err) {
      setError('Erro ao buscar campos');
      console.error('Error searching fields:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterFields = (filters: MapFilter) => {
    let filtered = [...fields];

    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter(field => filters.type.includes(field.type));
    }

    // Filter by size
    if (filters.size.length > 0) {
      filtered = filtered.filter(field => filters.size.includes(field.size));
    }

    // Filter by price range
    filtered = filtered.filter(field => 
      field.price >= filters.priceRange[0] && field.price <= filters.priceRange[1]
    );

    // Filter by rating
    filtered = filtered.filter(field => field.rating >= filters.rating);

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(field =>
        filters.amenities.some(amenity => field.amenities.includes(amenity))
      );
    }

    return filtered;
  };

  const selectField = async (fieldId: string) => {
    try {
      const field = await api.getFieldById(fieldId);
      setSelectedField(field);
      
      if (field) {
        setMapCenter(field.coordinates);
        setMapZoom(15);
      }
    } catch (err) {
      setError('Erro ao carregar detalhes do campo');
      console.error('Error selecting field:', err);
    }
  };

  const clearSelection = () => {
    setSelectedField(null);
    setMapZoom(12);
  };

  useEffect(() => {
    loadFields();
  }, []);

  return {
    fields,
    selectedField,
    loading,
    error,
    viewMode,
    mapCenter,
    mapZoom,
    loadFields,
    searchFields,
    filterFields,
    selectField,
    clearSelection,
    setViewMode,
    setMapCenter,
    setMapZoom
  };
};