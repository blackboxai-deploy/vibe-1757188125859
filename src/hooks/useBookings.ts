'use client';

import { useState, useEffect } from 'react';
import { Booking, TimeSlot } from '@/lib/types';
import { api } from '@/lib/api';

export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserBookings = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUserBookings(userId);
      setBookings(data);
    } catch (err) {
      setError('Erro ao carregar reservas');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFieldAvailability = async (fieldId: string, date: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFieldAvailability(fieldId, date);
      setAvailability(data);
    } catch (err) {
      setError('Erro ao carregar disponibilidade');
      console.error('Error loading availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const newBooking = await api.createBooking(bookingData);
      setBookings(prev => [newBooking, ...prev]);
      
      // Update availability to mark slot as unavailable
      setAvailability(prev => 
        prev.map(slot => 
          slot.date === bookingData.date && 
          slot.startTime === bookingData.startTime
            ? { ...slot, isAvailable: false }
            : slot
        )
      );
      
      return true;
    } catch (err) {
      setError('Erro ao criar reserva');
      console.error('Error creating booking:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock cancellation
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
      
      return true;
    } catch (err) {
      setError('Erro ao cancelar reserva');
      console.error('Error cancelling booking:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByStatus = (status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
      return bookingDate > now && booking.status === 'confirmed';
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getTotalSpent = () => {
    return bookings
      .filter(booking => booking.status === 'confirmed')
      .reduce((total, booking) => total + booking.totalPrice, 0);
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const confirmed = getBookingsByStatus('confirmed').length;
    const pending = getBookingsByStatus('pending').length;
    const cancelled = getBookingsByStatus('cancelled').length;
    const totalSpent = getTotalSpent();
    
    return {
      total,
      confirmed,
      pending,
      cancelled,
      totalSpent
    };
  };

  useEffect(() => {
    if (userId) {
      loadUserBookings();
    }
  }, [userId]);

  return {
    bookings,
    availability,
    loading,
    error,
    loadUserBookings,
    loadFieldAvailability,
    createBooking,
    cancelBooking,
    getBookingsByStatus,
    getUpcomingBookings,
    getTotalSpent,
    getBookingStats,
    clearError: () => setError(null)
  };
};