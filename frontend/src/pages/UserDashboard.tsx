
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Define Reservation type
interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  date: Date;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Mock reservation data
const mockReservations: Reservation[] = [
  {
    id: '1',
    roomId: '2',
    roomName: 'Creative Studio',
    roomImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days in future
    timeSlot: '10:00 - 11:00',
    status: 'upcoming'
  },
  {
    id: '2',
    roomId: '1',
    roomName: 'Executive Conference Room',
    roomImage: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day in future
    timeSlot: '14:00 - 15:00',
    status: 'upcoming'
  },
  {
    id: '3',
    roomId: '4',
    roomName: 'Small Meeting Room',
    roomImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days in past
    timeSlot: '09:00 - 10:00',
    status: 'completed'
  }
];

const UserDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle cancel reservation
  const handleCancelReservation = (reservationId: string) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: 'cancelled' as const } 
          : res
      )
    );
    
    toast({
      title: "Reservation Cancelled",
      description: "Your reservation has been successfully cancelled.",
    });
  };
  
  // Filter reservations by status
  const upcomingReservations = reservations.filter(r => r.status === 'upcoming');
  const pastReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Manage your room reservations</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              {/* Sidebar */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-3">
                        {user?.name.charAt(0) || 'U'}
                      </div>
                      <h2 className="text-lg font-bold">{user?.name}</h2>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => navigate('/rooms')}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book a Room
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              {/* Main Content */}
              <div className="space-y-6">
                {/* Upcoming Reservations */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Upcoming Reservations</h2>
                  
                  {upcomingReservations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingReservations.map((reservation) => (
                        <Card key={reservation.id} className="overflow-hidden">
                          <div className="relative h-36">
                            <img 
                              src={reservation.roomImage} 
                              alt={reservation.roomName} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <h3 className="text-white font-medium">{reservation.roomName}</h3>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-gray-500 text-sm">{format(reservation.date, 'EEEE, MMM d, yyyy')}</p>
                                <p className="font-medium">{reservation.timeSlot}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Upcoming
                              </Badge>
                            </div>
                            
                            <div className="flex justify-between mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500"
                                onClick={() => navigate(`/rooms/${reservation.roomId}`)}
                              >
                                View Room
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-500">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel your reservation for {reservation.roomName} on {format(reservation.date, 'MMM d')} at {reservation.timeSlot}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelReservation(reservation.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Yes, Cancel
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-gray-50 border-dashed">
                      <CardContent className="p-6 text-center">
                        <div className="py-8">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Reservations</h3>
                          <p className="text-gray-500 mb-4">
                            You don't have any upcoming room reservations.
                          </p>
                          <Button onClick={() => navigate('/rooms')}>
                            Book a Room
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Past Reservations */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Past Reservations</h2>
                  
                  {pastReservations.length > 0 ? (
                    <Card>
                      <div className="p-4">
                        <div className="divide-y">
                          {pastReservations.map((reservation) => (
                            <div key={reservation.id} className="py-4 first:pt-0 last:pb-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded overflow-hidden mr-4">
                                    <img 
                                      src={reservation.roomImage} 
                                      alt={reservation.roomName} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{reservation.roomName}</h4>
                                    <p className="text-sm text-gray-500">
                                      {format(reservation.date, 'MMM d, yyyy')} · {reservation.timeSlot}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  {reservation.status === 'completed' ? (
                                    <Badge className="flex items-center bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge className="flex items-center bg-red-100 text-red-800 hover:bg-red-100">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Cancelled
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50 border-dashed">
                      <CardContent className="p-6 text-center">
                        <div className="py-4">
                          <p className="text-gray-500">No past reservations found.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
