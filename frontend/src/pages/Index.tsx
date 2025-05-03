
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Calendar, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard, { Room } from '@/components/RoomCard';

// Mock featured rooms
const featuredRooms: Room[] = [
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
  }
];

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Simple Room Booking for Your Organization
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in">
                Find and book the perfect room for your meetings, events, and collaborative sessions.
              </p>
              <div className="space-x-4 animate-fade-in">
                <Link to="/rooms">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Browse Rooms
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Roomly</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes room booking simple and efficient for everyone in your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="bg-roomly-blue-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="text-roomly-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">
                Book rooms in seconds with our intuitive calendar interface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-roomly-green-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-roomly-green h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Manage permissions and bookings for your entire organization.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-roomly-blue-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Monitor className="text-roomly-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipment Tracking</h3>
              <p className="text-gray-600">
                Find rooms with the specific equipment you need for your meeting.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Rooms Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Rooms</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our most popular rooms for your next meeting or event
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/rooms">
                <Button>View All Rooms</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Booking a room with Roomly is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-roomly-blue-light mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-roomly-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Rooms</h3>
              <p className="text-gray-600">
                Search through our selection of rooms filtered by capacity and features.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-roomly-blue-light mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-roomly-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Date & Time</h3>
              <p className="text-gray-600">
                Choose your preferred date and time slot for your reservation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-roomly-blue-light mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-roomly-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Confirm Booking</h3>
              <p className="text-gray-600">
                Complete your reservation and receive a confirmation with all details.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to simplify room booking?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of organizations that trust Roomly for their room reservation needs.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
