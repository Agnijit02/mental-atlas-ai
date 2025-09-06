import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { 
  MessageCircle, 
  FileText, 
  Brain, 
  Sparkles, 
  Upload, 
  Zap,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Interactive Chat',
      description: 'Ask questions about your documents and get instant, intelligent responses powered by AI.'
    },
    {
      icon: FileText,
      title: 'Smart Summaries',
      description: 'Transform lengthy documents into concise, digestible summaries that capture key insights.'
    },
    {
      icon: Brain,
      title: 'Visual Mindmaps',
      description: 'Generate beautiful mindmaps to visualize concepts and relationships in your study materials.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-notemon-text-main">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-notemon-text-main via-notemon-primary to-notemon-text-main bg-clip-text text-transparent">
                NoteMon
              </span>
              <br />
              <span className="text-notemon-text-main">
                Your AI-Powered Study Partner
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-notemon-text-secondary max-w-3xl mx-auto mb-8">
              Transform your study materials with intelligent summaries, interactive chat, and visual mindmaps. 
              Learn smarter, not harder with the power of artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary hover:bg-notemon-primary-hover text-white shadow-glow px-8 py-6 text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-notemon-surface text-notemon-text-main hover:bg-notemon-surface/20 px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-notemon-text-main">
              Powerful AI Tools for Learning
            </h2>
            <p className="text-lg text-notemon-text-secondary max-w-2xl mx-auto">
              Experience the future of studying with our comprehensive suite of AI-powered tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-notemon-surface/50 border-notemon-surface backdrop-blur-sm p-8 hover:bg-notemon-surface/70 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-6 shadow-glow">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-notemon-text-main">
                  {feature.title}
                </h3>
                <p className="text-notemon-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-primary rounded-2xl p-12 shadow-glow">
            <Sparkles className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already learning smarter with NoteMon's AI-powered study tools.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-notemon-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold">
                Start Learning Today
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-notemon-surface">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-notemon-text-main">NoteMon</span>
          </div>
          <p className="text-notemon-text-secondary mb-4">
            Your AI-Powered Study Partner
          </p>
          <Link to="/dashboard">
            <Button className="bg-gradient-primary hover:bg-notemon-primary-hover text-white">
              Try NoteMon
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;