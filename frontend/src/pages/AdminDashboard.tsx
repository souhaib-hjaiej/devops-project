
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CalendarDays, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Room } from '@/components/RoomCard';

// Define Reservation type for admin view
interface AdminReservation {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  date: Date;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Mock data
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Executive Conference Room',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    capacity: 12,
    equipment: ['Projector', 'Whiteboard', 'Wifi'],
    description: 'Perfect for board meetings and important presentations with high-quality AV equipment.'
  },
  {
    id: '2',
    name: 'Creative Studio',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    capacity: 8,
    equipment: ['Whiteboard', 'Wifi', 'Computer'],
    description: 'Designed for brainstorming sessions and creative collaboration.'
  },
  {
    id: '3',
    name: 'Training Room',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    capacity: 20,
    equipment: ['Projector', 'Computer', 'Wifi'],
    description: 'Spacious room equipped with everything needed for workshops and training sessions.'
  },
  {
    id: '4',
    name: 'Small Meeting Room',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    capacity: 4,
    equipment: ['Whiteboard', 'Wifi'],
    description: 'Intimate meeting space perfect for small team discussions and one-on-one meetings.'
  },
  {
    id: '5',
    name: 'Media Room',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    capacity: 10,
    equipment: ['Projector', 'Surround Sound', 'Computer', 'Wifi'],
    description: 'Specialized room for media presentations, video conferencing, and multimedia projects.'
  }
];

const mockReservations: AdminReservation[] = [
  {
    id: '1',
    roomId: '2',
    roomName: 'Creative Studio',
    userId: 'user1',
    userName: 'John Doe',
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days in future
    timeSlot: '10:00 - 11:00',
    status: 'upcoming'
  },
  {
    id: '2',
    roomId: '1',
    roomName: 'Executive Conference Room',
    userId: 'user2',
    userName: 'Jane Smith',
    date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day in future
    timeSlot: '14:00 - 15:00',
    status: 'upcoming'
  },
  {
    id: '3',
    roomId: '4',
    roomName: 'Small Meeting Room',
    userId: 'user1',
    userName: 'John Doe',
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days in past
    timeSlot: '09:00 - 10:00',
    status: 'completed'
  },
  {
    id: '4',
    roomId: '5',
    roomName: 'Media Room',
    userId: 'user3',
    userName: 'Robert Johnson',
    date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
    timeSlot: '15:00 - 16:00',
    status: 'upcoming'
  },
  {
    id: '5',
    roomId: '3',
    roomName: 'Training Room',
    userId: 'user4',
    userName: 'Sarah Williams',
    date: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day in past
    timeSlot: '13:00 - 14:00',
    status: 'cancelled'
  }
];

const AdminDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [reservations, setReservations] = useState<AdminReservation[]>(mockReservations);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    capacity: 0,
    equipment: [],
    description: '',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'
  });
  const [equipmentInput, setEquipmentInput] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle room deletion
  const handleDeleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    
    toast({
      title: "Room Deleted",
      description: "The room has been successfully removed.",
    });
  };
  
  // Handle reservation cancellation
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
      description: "The reservation has been successfully cancelled.",
    });
  };
  
  // Handle room edit form submission
  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRoom) return;
    
    setRooms(prev => 
      prev.map(room => 
        room.id === editingRoom.id ? editingRoom : room
      )
    );
    
    toast({
      title: "Room Updated",
      description: `${editingRoom.name} has been successfully updated.`,
    });
    
    setEditingRoom(null);
  };
  
  // Handle new room creation
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRoom.name || !newRoom.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const createdRoom: Room = {
      id: `${rooms.length + 1}`,
      name: newRoom.name,
      description: newRoom.description,
      capacity: newRoom.capacity || 0,
      equipment: newRoom.equipment || [],
      image: newRoom.image || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'
    };
    
    setRooms(prev => [...prev, createdRoom]);
    
    toast({
      title: "Room Created",
      description: `${createdRoom.name} has been successfully added.`,
    });
    
    // Reset form
    setNewRoom({
      name: '',
      capacity: 0,
      equipment: [],
      description: '',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'
    });
  };
  
  // Handle adding equipment
  const handleAddEquipment = (type: 'edit' | 'new') => {
    if (!equipmentInput.trim()) return;
    
    if (type === 'edit' && editingRoom) {
      setEditingRoom({
        ...editingRoom,
        equipment: [...editingRoom.equipment, equipmentInput.trim()]
      });
    } else if (type === 'new') {
      setNewRoom({
        ...newRoom,
        equipment: [...(newRoom.equipment || []), equipmentInput.trim()]
      });
    }
    
    setEquipmentInput('');
  };
  
  // Handle removing equipment
  const handleRemoveEquipment = (type: 'edit' | 'new', index: number) => {
    if (type === 'edit' && editingRoom) {
      setEditingRoom({
        ...editingRoom,
        equipment: editingRoom.equipment.filter((_, i) => i !== index)
      });
    } else if (type === 'new' && newRoom.equipment) {
      setNewRoom({
        ...newRoom,
        equipment: newRoom.equipment.filter((_, i) => i !== index)
      });
    }
  };
  
  // Filter reservations by status
  const upcomingReservations = reservations.filter(r => r.status === 'upcoming');
  const pastReservations = reservations.filter(r => r.status !== 'upcoming');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage rooms and reservations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6 flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Rooms</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6 flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <CalendarDays className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Reservations</p>
                  <p className="text-2xl font-bold">{upcomingReservations.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="rooms">
            <TabsList className="mb-6">
              <TabsTrigger value="rooms">Manage Rooms</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Rooms</h2>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Room</DialogTitle>
                      <DialogDescription>
                        Create a new room that will be available for users to reserve.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateRoom} className="space-y-4 py-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Room Name</Label>
                          <Input 
                            id="name" 
                            placeholder="Enter room name"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input 
                            id="capacity" 
                            type="number"
                            placeholder="Max number of people"
                            value={newRoom.capacity || ''}
                            onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Describe the room"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="equipment">Equipment</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="equipment" 
                              placeholder="E.g., Projector"
                              value={equipmentInput}
                              onChange={(e) => setEquipmentInput(e.target.value)}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => handleAddEquipment('new')}
                            >
                              Add
                            </Button>
                          </div>
                          
                          {newRoom.equipment && newRoom.equipment.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newRoom.equipment.map((item, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  {item}
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveEquipment('new', index)}
                                    className="text-gray-400 hover:text-gray-700 ml-1"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="image">Image URL</Label>
                          <Input 
                            id="image" 
                            placeholder="Enter image URL"
                            value={newRoom.image}
                            onChange={(e) => setNewRoom({...newRoom, image: e.target.value})}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit">Create Room</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-700 text-left">
                      <tr>
                        <th className="px-6 py-3 text-sm font-medium">Room Name</th>
                        <th className="px-6 py-3 text-sm font-medium">Capacity</th>
                        <th className="px-6 py-3 text-sm font-medium">Equipment</th>
                        <th className="px-6 py-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded overflow-hidden mr-3">
                                <img 
                                  src={room.image} 
                                  alt={room.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{room.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {room.capacity} people
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {room.equipment.map((item, idx) => (
                                <Badge key={idx} variant="outline" className="bg-gray-100">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setEditingRoom(room)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                {editingRoom && editingRoom.id === room.id && (
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Edit Room</DialogTitle>
                                    </DialogHeader>
                                    
                                    <form onSubmit={handleEditRoom} className="space-y-4 py-4">
                                      <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-name">Room Name</Label>
                                          <Input 
                                            id="edit-name" 
                                            value={editingRoom.name}
                                            onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})}
                                            required
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-capacity">Capacity</Label>
                                          <Input 
                                            id="edit-capacity" 
                                            type="number"
                                            value={editingRoom.capacity || ''}
                                            onChange={(e) => setEditingRoom({...editingRoom, capacity: parseInt(e.target.value)})}
                                            required
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-description">Description</Label>
                                          <Textarea 
                                            id="edit-description" 
                                            value={editingRoom.description}
                                            onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})}
                                            required
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-equipment">Equipment</Label>
                                          <div className="flex gap-2">
                                            <Input 
                                              id="edit-equipment" 
                                              placeholder="E.g., Projector"
                                              value={equipmentInput}
                                              onChange={(e) => setEquipmentInput(e.target.value)}
                                            />
                                            <Button 
                                              type="button" 
                                              variant="outline"
                                              onClick={() => handleAddEquipment('edit')}
                                            >
                                              Add
                                            </Button>
                                          </div>
                                          
                                          {editingRoom.equipment && editingRoom.equipment.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                              {editingRoom.equipment.map((item, index) => (
                                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                  {item}
                                                  <button 
                                                    type="button"
                                                    onClick={() => handleRemoveEquipment('edit', index)}
                                                    className="text-gray-400 hover:text-gray-700 ml-1"
                                                  >
                                                    ×
                                                  </button>
                                                </Badge>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-image">Image URL</Label>
                                          <Input 
                                            id="edit-image" 
                                            value={editingRoom.image}
                                            onChange={(e) => setEditingRoom({...editingRoom, image: e.target.value})}
                                          />
                                        </div>
                                      </div>

                                      <DialogFooter>
                                        <Button type="submit">Save Changes</Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                )}
                              </Dialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Room</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {room.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteRoom(room.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {rooms.length === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-gray-500">No rooms available.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reservations">
              <div className="mb-6">
                <h2 className="text-xl font-bold">All Reservations</h2>
              </div>
              
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-gray-700 text-left">
                          <tr>
                            <th className="px-6 py-3 text-sm font-medium">Room</th>
                            <th className="px-6 py-3 text-sm font-medium">User</th>
                            <th className="px-6 py-3 text-sm font-medium">Date & Time</th>
                            <th className="px-6 py-3 text-sm font-medium">Status</th>
                            <th className="px-6 py-3 text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {upcomingReservations.map((reservation) => (
                            <tr key={reservation.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                {reservation.roomName}
                              </td>
                              <td className="px-6 py-4">
                                {reservation.userName}
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p>{format(reservation.date, 'MMM d, yyyy')}</p>
                                  <p className="text-gray-500 text-sm">{reservation.timeSlot}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Upcoming
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this reservation? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>No, Keep it</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelReservation(reservation.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Yes, Cancel
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {upcomingReservations.length === 0 && (
                        <div className="py-10 text-center">
                          <p className="text-gray-500">No upcoming reservations.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="past">
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-gray-700 text-left">
                          <tr>
                            <th className="px-6 py-3 text-sm font-medium">Room</th>
                            <th className="px-6 py-3 text-sm font-medium">User</th>
                            <th className="px-6 py-3 text-sm font-medium">Date & Time</th>
                            <th className="px-6 py-3 text-sm font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {pastReservations.map((reservation) => (
                            <tr key={reservation.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                {reservation.roomName}
                              </td>
                              <td className="px-6 py-4">
                                {reservation.userName}
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p>{format(reservation.date, 'MMM d, yyyy')}</p>
                                  <p className="text-gray-500 text-sm">{reservation.timeSlot}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {reservation.status === 'completed' ? (
                                  <Badge className="bg-blue-100 text-blue-800 flex items-center w-fit hover:bg-blue-100">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 flex items-center w-fit hover:bg-red-100">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Cancelled
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {pastReservations.length === 0 && (
                        <div className="py-10 text-center">
                          <p className="text-gray-500">No past reservations.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
