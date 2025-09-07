import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: 'Google sign in failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
    // Note: For Google OAuth, the redirect happens automatically
  };

  return (
    <Card className="bg-notemon-surface/50 border-notemon-surface backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-notemon-text-main">Welcome Back!</CardTitle>
        <CardDescription className="text-notemon-text-secondary">
          Sign in to continue to NoteMon
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="bg-notemon-background/50 border-notemon-surface"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="text-sm text-notemon-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="bg-notemon-background/50 border-notemon-surface"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-primary hover:bg-notemon-primary-hover text-white shadow-glow"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-notemon-surface" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-notemon-surface px-2 text-notemon-text-secondary">
                Or continue with
              </span>
            </div>
          </div>
          <Button 
            type="button"
            variant="outline" 
            className="w-full bg-transparent border-notemon-surface hover:bg-notemon-surface/20"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Login with Google'
            )}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="text-center text-sm text-notemon-text-secondary">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="text-notemon-primary hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;