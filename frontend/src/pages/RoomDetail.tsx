
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Monitor, Clock, Wifi } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import ReservationForm from '@/components/ReservationForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Import the Room interface
import { Room } from '@/components/RoomCard';

// Mock room data
const allRooms: Room[] = [
  {
    id: '1',
    name: 'Executive Conference Room',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    capacity: 12,
    equipment: ['Projector', 'Whiteboard', 'Wifi'],
    description: 'Perfect for board meetings and important presentations with high-quality AV equipment. This spacious room features a large conference table, comfortable executive chairs, and state-of-the-art presentation tools.'
  },
  {
    id: '2',
    name: 'Creative Studio',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    capacity: 8,
    equipment: ['Whiteboard', 'Wifi', 'Computer'],
    description: 'Designed for brainstorming sessions and creative collaboration. With movable furniture, multiple whiteboards, and a relaxed atmosphere, this room is perfect for teams looking to innovate.'
  },
  {
    id: '3',
    name: 'Training Room',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    capacity: 20,
    equipment: ['Projector', 'Computer', 'Wifi'],
    description: 'Spacious room equipped with everything needed for workshops and training sessions. Features classroom-style seating, excellent acoustics, and comprehensive AV equipment for effective learning experiences.'
  },
  {
    id: '4',
    name: 'Small Meeting Room',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    capacity: 4,
    equipment: ['Whiteboard', 'Wifi'],
    description: 'Intimate meeting space perfect for small team discussions and one-on-one meetings. Offers privacy and all the essentials needed for productive conversations.'
  },
  {
    id: '5',
    name: 'Media Room',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    capacity: 10,
    equipment: ['Projector', 'Surround Sound', 'Computer', 'Wifi'],
    description: 'Specialized room for media presentations, video conferencing, and multimedia projects. Features high-definition displays, professional audio equipment, and comfortable seating arrangements.'
  }
];

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Find the selected room
  const room = allRooms.find(r => r.id === roomId);
  
  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Room Not Found</h2>
            <p className="text-gray-600 mb-4">The room you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/rooms')}>
              Back to Rooms
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleReservationSuccess = () => {
    setIsDialogOpen(false);
    navigate('/dashboard');
  };
  
  const handleReserveClick = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/rooms/${roomId}` } });
      return;
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/rooms')}
              className="mb-4"
            >
              ← Back to Rooms
            </Button>
            
            <h1 className="text-3xl font-bold">{room.name}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room image and details */}
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden mb-6">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <div className="bg-white rounded-xl border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About This Room</h2>
                <p className="text-gray-600 mb-6">
                  {room.description}
                </p>
                
                <Separator className="my-6" />
                
                <h3 className="font-semibold mb-3">Room Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-roomly-blue-light p-2 rounded-full">
                      <Users className="h-5 w-5 text-roomly-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">{room.capacity} people</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-roomly-blue-light p-2 rounded-full">
                      <Clock className="h-5 w-5 text-roomly-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Equipment</h2>
                <div className="flex flex-wrap gap-2">
                  {room.equipment.map((item, index) => (
                    <Badge key={index} variant="outline" className="bg-roomly-blue-light text-roomly-blue border-roomly-blue-light">
                      {item === 'Computer' && <Monitor className="h-3 w-3 mr-1" />}
                      {item === 'Wifi' && <Wifi className="h-3 w-3 mr-1" />}
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reservation card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Reserve This Room</h2>
                <p className="text-gray-600 mb-4">
                  Need this space for your next meeting or event? Book it now to secure your slot.
                </p>
                
                <Separator className="my-4" />
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{room.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipment</span>
                    <span className="font-medium">{room.equipment.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                </div>
                
                <Button className="w-full" size="lg" onClick={handleReserveClick}>
                  {isAuthenticated ? 'Reserve Now' : 'Login to Reserve'}
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    You need to be logged in to make a reservation
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Reservation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve {room.name}</DialogTitle>
          </DialogHeader>
          <ReservationForm room={room} onSuccess={handleReservationSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomDetail;
