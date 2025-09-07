import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-notemon-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold bg-gradient-to-r from-notemon-text-main to-notemon-primary bg-clip-text text-transparent">
              NoteMon
            </span>
          </Link>

          {/* Navigation Links */}
         <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-notemon-surface/20">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:bg-notemon-primary-hover text-white shadow-glow">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;