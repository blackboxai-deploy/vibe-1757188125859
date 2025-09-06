export interface FootballField {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'outdoor' | 'indoor' | 'synthetic' | 'grass';
  size: '5v5' | '7v7' | '11v11';
  price: number;
  priceUnit: 'hour' | 'match';
  rating: number;
  totalRatings: number;
  amenities: string[];
  images: string[];
  description: string;
  availability: TimeSlot[];
  contact: {
    phone: string;
    email: string;
  };
  isVerified: boolean;
  isOpen: boolean;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface Booking {
  id: string;
  fieldId: string;
  fieldName: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  playerCount: number;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  favoriteFields: string[];
  bookings: Booking[];
  createdAt: string;
}

export interface MapFilter {
  type: string[];
  size: string[];
  priceRange: [number, number];
  rating: number;
  amenities: string[];
  availability: {
    date: string;
    startTime: string;
    endTime: string;
  } | null;
}

export interface SearchParams {
  query: string;
  location: string;
  filters: MapFilter;
}

export type ViewMode = 'map' | 'list' | 'grid';