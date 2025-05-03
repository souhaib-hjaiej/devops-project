
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Monitor, Wifi } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export interface Room {
  id: string;
  name: string;
  image: string;
  capacity: number;
  equipment: string[];
  description: string;
}

interface RoomCardProps {
  room: Room;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <Card className="overflow-hidden card-hover animate-fade-in">
      <div className="relative h-48">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover"
        />
        {room.capacity && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white text-sm px-2 py-1 rounded-full">
            <Users className="h-3.5 w-3.5" />
            <span>{room.capacity} capacity</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {room.equipment.map((item, index) => (
            <Badge key={index} variant="outline" className="bg-roomly-blue-light text-roomly-blue border-roomly-blue-light">
              {item === 'Computer' && <Monitor className="h-3 w-3 mr-1" />}
              {item === 'Wifi' && <Wifi className="h-3 w-3 mr-1" />}
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        {isAdmin ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        ) : (
          <Link to={`/rooms/${room.id}`} className="w-full">
            <Button className="w-full" disabled={!isAuthenticated}>
              {isAuthenticated ? 'Reserve' : 'View Details'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
