
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogIn, Home, Calendar, CheckSquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 md:px-8 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Roomly</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              isActive('/') ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/rooms" 
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              isActive('/rooms') ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Rooms</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {!isAuthenticated ? (
            <Link to="/auth">
              <Button className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button onClick={logout} className="w-full text-left cursor-pointer text-red-500">
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
