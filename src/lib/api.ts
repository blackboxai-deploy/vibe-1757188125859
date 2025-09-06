import { FootballField, Booking, User, TimeSlot } from './types';

// Mock data for development
export const mockFields: FootballField[] = [
  {
    id: '1',
    name: 'Arena Sports Complex',
    address: 'Rua das Palmeiras, 123 - Vila Madalena, São Paulo',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    type: 'synthetic',
    size: '7v7',
    price: 120,
    priceUnit: 'hour',
    rating: 4.5,
    totalRatings: 127,
    amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Water'],
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7a6e77af-db61-4b1f-bc89-0bc0e352e6e6.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/01b1dfe8-699b-40df-98eb-61b3c016ff19.png'
    ],
    description: 'Campo sintético profissional com iluminação LED e vestiários completos.',
    availability: [
      { id: '1-1', date: '2024-01-15', startTime: '19:00', endTime: '20:00', isAvailable: true, price: 120 },
      { id: '1-2', date: '2024-01-15', startTime: '20:00', endTime: '21:00', isAvailable: false, price: 120 },
      { id: '1-3', date: '2024-01-16', startTime: '18:00', endTime: '19:00', isAvailable: true, price: 120 }
    ],
    contact: { phone: '(11) 99999-9999', email: 'arena@sports.com' },
    isVerified: true,
    isOpen: true
  },
  {
    id: '2',
    name: 'Campo do Parque',
    address: 'Av. Paulista, 456 - Bela Vista, São Paulo',
    coordinates: { lat: -23.5615, lng: -46.6560 },
    type: 'grass',
    size: '11v11',
    price: 200,
    priceUnit: 'match',
    rating: 4.2,
    totalRatings: 89,
    amenities: ['Natural Grass', 'Parking', 'Snack Bar', 'Scoreboard'],
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/89784fcf-8026-4562-a892-21704953a8f5.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dedac33c-eb63-41a9-a029-8c07cb4d44ac.png'
    ],
    description: 'Campo de grama natural oficial com arquibancadas e placar eletrônico.',
    availability: [
      { id: '2-1', date: '2024-01-15', startTime: '16:00', endTime: '18:00', isAvailable: true, price: 200 },
      { id: '2-2', date: '2024-01-16', startTime: '14:00', endTime: '16:00', isAvailable: true, price: 200 }
    ],
    contact: { phone: '(11) 88888-8888', email: 'campo@parque.com' },
    isVerified: true,
    isOpen: true
  },
  {
    id: '3',
    name: 'Quadra Coberta Central',
    address: 'Rua Augusta, 789 - Consolação, São Paulo',
    coordinates: { lat: -23.5556, lng: -46.6627 },
    type: 'indoor',
    size: '5v5',
    price: 80,
    priceUnit: 'hour',
    rating: 4.0,
    totalRatings: 203,
    amenities: ['Indoor', 'Air Conditioning', 'Sound System', 'Parking'],
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5d130040-e6e9-4192-99e9-0fdc0a6b2f4b.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ea9f7e20-36db-4af6-983a-70d2ff4fe0db.png'
    ],
    description: 'Quadra coberta climatizada ideal para futsal e peladas.',
    availability: [
      { id: '3-1', date: '2024-01-15', startTime: '18:00', endTime: '19:00', isAvailable: true, price: 80 },
      { id: '3-2', date: '2024-01-15', startTime: '21:00', endTime: '22:00', isAvailable: true, price: 80 }
    ],
    contact: { phone: '(11) 77777-7777', email: 'quadra@central.com' },
    isVerified: false,
    isOpen: true
  }
];

export const mockUser: User = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/243a1de6-6d2d-453c-b0ea-b286bdd9ec9b.png',
  favoriteFields: ['1', '2'],
  bookings: [
    {
      id: 'booking-1',
      fieldId: '1',
      fieldName: 'Arena Sports Complex',
      userId: 'user-1',
      date: '2024-01-15',
      startTime: '19:00',
      endTime: '20:00',
      totalPrice: 120,
      status: 'confirmed',
      createdAt: '2024-01-10T10:00:00Z',
      playerCount: 14,
      notes: 'Pelada com os amigos do trabalho'
    }
  ],
  createdAt: '2023-06-01T00:00:00Z'
};

// API functions (mock implementation)
export const api = {
  // Fields
  getFields: async (): Promise<FootballField[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockFields;
  },

  getFieldById: async (id: string): Promise<FootballField | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFields.find(field => field.id === id) || null;
  },

  searchFields: async (query: string): Promise<FootballField[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockFields.filter(field => 
      field.name.toLowerCase().includes(query.toLowerCase()) ||
      field.address.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Bookings
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  getUserBookings: async (_userId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUser.bookings;
  },

  // User
  getCurrentUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;
  },

  // Availability
  getFieldAvailability: async (fieldId: string, date: string): Promise<TimeSlot[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const field = mockFields.find(f => f.id === fieldId);
    return field?.availability.filter(slot => slot.date === date) || [];
  }
};