import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignUpCard = () => {
  return (
    <Card className="bg-notemon-surface/50 border-notemon-surface backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-notemon-text-main">Create an Account</CardTitle>
        <CardDescription className="text-notemon-text-secondary">
          Get started with your AI-powered study partner today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" className="bg-notemon-background/50 border-notemon-surface" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="bg-notemon-background/50 border-notemon-surface" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" className="bg-notemon-background/50 border-notemon-surface" />
        </div>
        <Button className="w-full bg-gradient-primary hover:bg-notemon-primary-hover text-white shadow-glow">
          Create Account
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
        <Button variant="outline" className="w-full bg-transparent border-notemon-surface hover:bg-notemon-surface/20">
          Sign Up with Google
        </Button>
      </CardContent>
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