import { useLocation } from 'react-router-dom';
import LoginCard from '@/components/LoginCard';
import SignUpCard from '@/components/SignUpCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';    
import { BookOpen } from 'lucide-react';

const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-2 mb-8">
        <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-notemon-text-main to-notemon-primary bg-clip-text text-transparent">
          NoteMon
        </span>
      </div>
      <div className="w-full max-w-md">
        {isLoginPage ? <LoginCard /> : <SignUpCard />}
      </div>
    </div>
  );
};

export default AuthPage;