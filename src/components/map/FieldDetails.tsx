'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FootballField } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

interface FieldDetailsProps {
  field: FootballField;
  onClose: () => void;
}

export default function FieldDetails({ field, onClose }: FieldDetailsProps) {
  const { isAuthenticated, addToFavorites, removeFromFavorites, user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  const isFavorite = user?.favoriteFields?.includes(field.id) || false;
  const availableSlots = field.availability.filter(slot => slot.isAvailable);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) return;
    
    if (isFavorite) {
      await removeFromFavorites(field.id);
    } else {
      await addToFavorites(field.id);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % field.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + field.images.length) % field.images.length);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-lg">{field.name}</CardTitle>
              {field.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Verificado ✓
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{field.address}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className={isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Image Gallery */}
        {field.images.length > 0 && (
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={field.images[currentImageIndex]}
                alt={`${field.name} - Foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {field.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    &#8249;
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    &#8250;
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {field.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Field Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">R$ {field.price}</div>
            <div className="text-xs text-gray-500">{field.priceUnit === 'hour' ? 'por hora' : 'por jogo'}</div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold">{field.rating}</span>
            </div>
            <div className="text-xs text-gray-500">{field.totalRatings} avaliações</div>
          </div>
          <div>
            <div className="font-bold">{field.size}</div>
            <div className="text-xs text-gray-500">Modalidade</div>
          </div>
          <div>
            <div className="font-bold capitalize">{field.type}</div>
            <div className="text-xs text-gray-500">Tipo</div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Descrição</h4>
          <p className="text-sm text-gray-600">{field.description}</p>
        </div>

        {/* Amenities */}
        {field.amenities.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Facilidades</h4>
            <div className="flex flex-wrap gap-2">
              {field.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Availability */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Disponibilidade</h4>
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${field.isOpen
                ? availableSlots.length > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
              }
            `}>
              {field.isOpen
                ? availableSlots.length > 0
                  ? `${availableSlots.length} horário${availableSlots.length > 1 ? 's' : ''} disponível${availableSlots.length > 1 ? 'eis' : ''}`
                  : 'Sem horários disponíveis'
                : 'Fechado'
              }
            </div>
          </div>

          <ScrollArea className="h-24">
            <div className="space-y-2">
              {field.availability.map((slot) => (
                <div
                  key={slot.id}
                  className={`
                    flex items-center justify-between p-2 rounded border text-sm
                    ${slot.isAvailable
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                    }
                  `}
                >
                  <div>
                    <span className="font-medium">
                      {new Date(slot.date).toLocaleDateString('pt-BR', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    <span className="ml-2">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <div className="font-medium">
                    R$ {slot.price}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Contact */}
        <div>
          <h4 className="font-medium mb-2">Contato</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <a href={`tel:${field.contact.phone}`} className="text-blue-600 hover:underline">
                {field.contact.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span>✉️</span>
              <a href={`mailto:${field.contact.email}`} className="text-blue-600 hover:underline">
                {field.contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={() => setShowBooking(true)}
            disabled={!field.isOpen || availableSlots.length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isAuthenticated ? 'Reservar' : 'Entrar para Reservar'}
          </Button>
          <Button variant="outline" className="flex-1">
            Ver no Mapa
          </Button>
        </div>

        {/* Quick Booking Modal would go here */}
        {showBooking && isAuthenticated && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium">Reserva Rápida</h5>
              <Button variant="ghost" size="sm" onClick={() => setShowBooking(false)}>
                ✕
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Selecione um horário disponível para fazer sua reserva.
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Ir para Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}