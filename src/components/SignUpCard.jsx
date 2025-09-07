import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const SignUpCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
      navigate('/login');
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: 'Google sign up failed',
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
        <CardTitle className="text-2xl text-notemon-text-main">Create an Account</CardTitle>
        <CardDescription className="text-notemon-text-secondary">
          Get started with your AI-powered study partner today
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              type="text" 
              placeholder="John Doe" 
              className="bg-notemon-background/50 border-notemon-surface"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="bg-notemon-background/50 border-notemon-surface"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Minimum 6 characters"
              className="bg-notemon-background/50 border-notemon-surface"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-notemon-surface" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-notemon-surface px-2 text-notemon-text-secondary">
                Or sign up with
              </span>
            </div>
          </div>
          <Button 
            type="button"
            variant="outline" 
            className="w-full bg-transparent border-notemon-surface hover:bg-notemon-surface/20"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Sign Up with Google'
            )}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="text-center text-sm text-notemon-text-secondary">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-notemon-primary hover:underline font-semibold">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpCard;