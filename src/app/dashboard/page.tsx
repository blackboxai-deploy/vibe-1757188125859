'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useMap } from '@/hooks/useMap';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { fields } = useMap();
  const {
    bookings,
    getUpcomingBookings,
    getBookingStats,
    cancelBooking,
    loading: bookingsLoading
  } = useBookings(user?.id);
  
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingBookings = getUpcomingBookings();
  const stats = getBookingStats();
  const favoriteFields = fields.filter(field => user.favoriteFields.includes(field.id));

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    const success = await cancelBooking(bookingId);
    if (success) {
      // Refresh would happen automatically through the hook
    }
    setCancellingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Olá, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600">
                Bem-vindo ao seu dashboard do FutMap
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total de Reservas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.confirmed}
              </div>
              <div className="text-sm text-gray-600">Confirmadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                R$ {stats.totalSpent}
              </div>
              <div className="text-sm text-gray-600">Total Gasto</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📅</span>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Nenhuma reserva próxima</h3>
                    <p className="text-gray-600 mb-4">Que tal reservar um campo para sua próxima pelada?</p>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <a href="/">Encontrar Campos</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{booking.fieldName}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>
                                📅 {new Date(booking.date).toLocaleDateString('pt-BR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </p>
                              <p>⏰ {booking.startTime} - {booking.endTime}</p>
                              <p>👥 {booking.playerCount} jogadores</p>
                              {booking.notes && <p>📝 {booking.notes}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                            >
                              {booking.status === 'confirmed' ? 'Confirmado' : 
                               booking.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </Badge>
                            <div className="text-lg font-bold text-green-600 mt-1">
                              R$ {booking.totalPrice}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingId === booking.id || booking.status !== 'confirmed'}
                            >
                              {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📋</span>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Nenhuma reserva ainda</h3>
                    <p className="text-gray-600">Seu histórico de reservas aparecerá aqui</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice().reverse().map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{booking.fieldName}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>📅 {new Date(booking.date).toLocaleDateString('pt-BR')}</p>
                              <p>⏰ {booking.startTime} - {booking.endTime}</p>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Reservado em {new Date(booking.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                booking.status === 'confirmed' ? 'default' :
                                booking.status === 'cancelled' ? 'destructive' : 'secondary'
                              }
                              className={
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''
                              }
                            >
                              {booking.status === 'confirmed' ? 'Confirmado' : 
                               booking.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </Badge>
                            <div className="text-lg font-bold text-green-600 mt-1">
                              R$ {booking.totalPrice}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorite Fields */}
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campos Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteFields.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">❤️</span>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Nenhum campo favoritado</h3>
                    <p className="text-gray-600 mb-4">Favorite campos para acessá-los rapidamente</p>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <a href="/">Explorar Campos</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteFields.map((field) => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={field.images[0]}
                            alt={field.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-gray-800">{field.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{field.address}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500 text-sm">⭐</span>
                            <span className="text-sm font-medium">{field.rating}</span>
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            R$ {field.price}/{field.priceUnit === 'hour' ? 'h' : 'jogo'}
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                          Ver Detalhes
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profile */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-green-100 text-green-600 text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome</label>
                    <p className="text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Membro desde</label>
                    <p className="text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex space-x-4">
                  <Button variant="outline">
                    Editar Perfil
                  </Button>
                  <Button variant="outline">
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}