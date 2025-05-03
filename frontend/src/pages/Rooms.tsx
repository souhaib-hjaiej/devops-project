
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard, { Room } from '@/components/RoomCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Checkbox,
} from "@/components/ui/checkbox";

// Mock room data
const allRooms: Room[] = [
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

// Equipment options for filtering
const equipmentOptions = ['Projector', 'Whiteboard', 'Wifi', 'Computer', 'Surround Sound'];

const Rooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string>('');
  const [equipmentFilters, setEquipmentFilters] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Edit and delete functions (for admin, would connect to API in real app)
  const handleEdit = (room: Room) => {
    toast({
      title: "Edit Room",
      description: `Editing ${room.name}`,
    });
  };
  
  const handleDelete = (room: Room) => {
    toast({
      title: "Delete Room",
      description: `Deleting ${room.name}`,
      variant: "destructive",
    });
  };
  
  // Toggle equipment filter
  const toggleEquipmentFilter = (equipment: string) => {
    setEquipmentFilters(prev => 
      prev.includes(equipment)
        ? prev.filter(item => item !== equipment)
        : [...prev, equipment]
    );
  };
  
  // Filter rooms based on search term and filters
  const filteredRooms = allRooms.filter(room => {
    // Search term filter
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Capacity filter
    const matchesCapacity = !capacityFilter || room.capacity >= Number(capacityFilter);
    
    // Equipment filter
    const matchesEquipment = equipmentFilters.length === 0 || 
                             equipmentFilters.every(eq => room.equipment.includes(eq));
    
    return matchesSearch && matchesCapacity && matchesEquipment;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-6 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Available Rooms</h1>
              <p className="text-gray-600">Find the perfect space for your next meeting or event</p>
            </div>
            
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-grow md:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search rooms..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Filter Rooms</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Capacity (Minimum)
                      </label>
                      <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any capacity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any capacity</SelectItem>
                          <SelectItem value="4">4+ people</SelectItem>
                          <SelectItem value="8">8+ people</SelectItem>
                          <SelectItem value="12">12+ people</SelectItem>
                          <SelectItem value="20">20+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Equipment
                      </label>
                      <div className="space-y-2">
                        {equipmentOptions.map((eq) => (
                          <div key={eq} className="flex items-center">
                            <Checkbox
                              id={`mobile-eq-${eq}`}
                              checked={equipmentFilters.includes(eq)}
                              onCheckedChange={() => toggleEquipmentFilter(eq)}
                            />
                            <label
                              htmlFor={`mobile-eq-${eq}`}
                              className="ml-2 text-sm font-medium"
                            >
                              {eq}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setCapacityFilter('');
                        setEquipmentFilters([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="font-semibold text-lg mb-4">Filters</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Capacity</h3>
                  <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any capacity</SelectItem>
                      <SelectItem value="4">4+ people</SelectItem>
                      <SelectItem value="8">8+ people</SelectItem>
                      <SelectItem value="12">12+ people</SelectItem>
                      <SelectItem value="20">20+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Equipment</h3>
                  <div className="space-y-2">
                    {equipmentOptions.map((eq) => (
                      <div key={eq} className="flex items-center">
                        <Checkbox
                          id={`eq-${eq}`}
                          checked={equipmentFilters.includes(eq)}
                          onCheckedChange={() => toggleEquipmentFilter(eq)}
                        />
                        <label
                          htmlFor={`eq-${eq}`}
                          className="ml-2 text-sm font-medium"
                        >
                          {eq}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => {
                    setCapacityFilter('');
                    setEquipmentFilters([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            
            {/* Room Grid */}
            <div className="flex-grow">
              {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onEdit={() => handleEdit(room)}
                      onDelete={() => handleDelete(room)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No rooms found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rooms;
