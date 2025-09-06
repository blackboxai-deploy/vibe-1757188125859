'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Header from '@/components/layout/Header';
import MapView from '@/components/map/MapView';
import { useMap } from '@/hooks/useMap';
import { MapFilter } from '@/lib/types';

export default function HomePage() {
  const {
    fields,
    selectedField,
    loading,
    error,
    viewMode,
    mapCenter,
    mapZoom,
    searchFields,
    filterFields,
    selectField,
    clearSelection,
    setViewMode
  } = useMap();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MapFilter>({
    type: [],
    size: [],
    priceRange: [0, 500],
    rating: 0,
    amenities: [],
    availability: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFields, setFilteredFields] = useState(fields);

  const fieldTypes = ['outdoor', 'indoor', 'synthetic', 'grass'];
  const fieldSizes = ['5v5', '7v7', '11v11'];
  const amenityOptions = ['Parking', 'Changing Rooms', 'Lighting', 'Water', 'Natural Grass', 'Snack Bar', 'Scoreboard', 'Air Conditioning', 'Sound System'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchFields(searchQuery);
    }
  };

  const handleFilterChange = (key: keyof MapFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const filtered = filterFields(filters);
    setFilteredFields(filtered);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      size: [],
      priceRange: [0, 500],
      rating: 0,
      amenities: [],
      availability: null
    });
    setFilteredFields(fields);
  };

  useEffect(() => {
    setFilteredFields(fields);
  }, [fields]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-xl">⚠️</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Erro ao carregar dados</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar campos por nome ou endereço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="ml-2 bg-green-600 hover:bg-green-700">
              Buscar
            </Button>
          </form>

          {/* Filter Toggle */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                Filtros
                {(filters.type.length > 0 || filters.size.length > 0 || filters.amenities.length > 0 || filters.rating > 0) && (
                  <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                    {filters.type.length + filters.size.length + filters.amenities.length + (filters.rating > 0 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filtros</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar
                  </Button>
                </div>

                {/* Type Filter */}
                <div>
                  <h4 className="font-medium mb-3">Tipo de Campo</h4>
                  <div className="space-y-2">
                    {fieldTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.type.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('type', [...filters.type, type]);
                            } else {
                              handleFilterChange('type', filters.type.filter(t => t !== type));
                            }
                          }}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm capitalize">
                          {type === 'outdoor' ? 'Aberto' : 
                           type === 'indoor' ? 'Coberto' :
                           type === 'synthetic' ? 'Sintético' : 'Grama Natural'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h4 className="font-medium mb-3">Modalidade</h4>
                  <div className="space-y-2">
                    {fieldSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={filters.size.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('size', [...filters.size, size]);
                            } else {
                              handleFilterChange('size', filters.size.filter(s => s !== size));
                            }
                          }}
                        />
                        <label htmlFor={`size-${size}`} className="text-sm">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Faixa de Preço</h4>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>R$ {filters.priceRange[0]}</span>
                      <span>R$ {filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium mb-3">Avaliação Mínima</h4>
                  <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseFloat(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Qualquer avaliação</SelectItem>
                      <SelectItem value="3">⭐ 3.0+</SelectItem>
                      <SelectItem value="3.5">⭐ 3.5+</SelectItem>
                      <SelectItem value="4">⭐ 4.0+</SelectItem>
                      <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium mb-3">Facilidades</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('amenities', [...filters.amenities, amenity]);
                            } else {
                              handleFilterChange('amenities', filters.amenities.filter(a => a !== amenity));
                            }
                          }}
                        />
                        <label htmlFor={`amenity-${amenity}`} className="text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={applyFilters} className="w-full bg-green-600 hover:bg-green-700">
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? 'bg-green-600' : ''}
            >
              🗺️ Mapa
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-green-600' : ''}
            >
              📋 Lista
            </Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {loading ? 'Carregando...' : `${filteredFields.length} campo${filteredFields.length !== 1 ? 's' : ''} encontrado${filteredFields.length !== 1 ? 's' : ''}`}
          </p>
          {selectedField && (
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Limpar seleção
            </Button>
          )}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando campos...</p>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <MapView
            fields={filteredFields}
            selectedField={selectedField}
            onFieldSelect={selectField}
            onFieldDeselect={clearSelection}
            center={mapCenter}
            zoom={mapZoom}
            className="h-96 md:h-[600px]"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <Card key={field.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => selectField(field.id)}>
                <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
                  <img
                    src={field.images[0]}
                    alt={field.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    {field.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{field.address}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{field.rating}</span>
                      <span className="text-sm text-gray-500">({field.totalRatings})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">R$ {field.price}</span>
                      <span className="text-sm text-gray-500">/{field.priceUnit === 'hour' ? 'h' : 'jogo'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">{field.size}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{field.type}</Badge>
                    </div>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${field.isOpen && field.availability.some(slot => slot.isAvailable)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }
                    `}>
                      {field.isOpen && field.availability.some(slot => slot.isAvailable) ? 'Disponível' : 'Indisponível'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}