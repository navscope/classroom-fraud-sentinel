
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out",
        scrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 animate-fade-in">
          <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">FD</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">
              Fraud Sentinel
            </h1>
            <p className="text-xs text-muted-foreground">
              Classroom Assignment Verification
            </p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors btn-transition",
              location.pathname === "/" ? "text-primary" : "hover:text-primary"
            )}
          >
            Home
          </Link>
          <Link 
            to="/history" 
            className={cn(
              "text-sm font-medium transition-colors btn-transition",
              location.pathname === "/history" ? "text-primary" : "hover:text-primary"
            )}
          >
            History
          </Link>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors btn-transition">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
