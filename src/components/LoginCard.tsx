import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginCard = () => {
  return (
    <Card className="bg-notemon-surface/50 border-notemon-surface backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-notemon-text-main">Welcome Back!</CardTitle>
        <CardDescription className="text-notemon-text-secondary">
          Sign in to continue to NoteMon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" className="bg-notemon-background/50 border-notemon-surface" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="#" className="text-sm text-notemon-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" className="bg-notemon-background/50 border-notemon-surface" />
        </div>
        <Button className="w-full bg-gradient-primary hover:bg-notemon-primary-hover text-white shadow-glow">
          Login
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
        <Button variant="outline" className="w-full bg-transparent border-notemon-surface hover:bg-notemon-surface/20">
          Login with Google
        </Button>
      </CardContent>
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