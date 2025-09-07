import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { 
  MessageCircle, 
  FileText, 
  Brain, 
  Sparkles, 
  Zap,
  ArrowRight,
  BookOpen,
  HelpCircle,
  UploadCloud,
  Wand2,
  AudioLines,
  Loader2
} from 'lucide-react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}


const LandingPage = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-notemon-primary mx-auto mb-4" />
          <p className="text-notemon-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
    },
    {
      icon: HelpCircle,
      title: 'FAQ Generation',
      description: 'Automatically create a list of frequently asked questions and answers from your document.'
    },
    {
      icon: AudioLines,
      title: 'Audio Overview',
      description: 'Listen to a spoken summary of your notes, perfect for on-the-go learning and accessibility.'
    }
  ];

  const howItWorksSteps = [
    {
      icon: UploadCloud,
      title: "1. Upload Your Notes",
      description: "Securely upload materials in various formats like PDF, DOCX, or simply paste text."
    },
    {
      icon: Wand2,
      title: "2. Choose Your AI Tool",
      description: "Select from summaries, visual mindmaps, automated FAQs, and more."
    },
    {
      icon: Sparkles,
      title: "3. Get Instant Insights",
      description: "Receive intelligent, easy-to-digest results in just a few seconds."
    }
  ];
  
  const [activeFeature, setActiveFeature] = useState(0);

  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    if (!vantaEffectRef.current && vantaRef.current) {
      if (window.VANTA && window.VANTA.HALO) {
        vantaEffectRef.current = window.VANTA.HALO({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          backgroundColor:  0x0d1117, // Matches your theme's background
          baseColor:   0x2563eb,       // A slightly lighter halo color
          amplitudeFactor: 1.50,
          size: 1.20,
          xOffset: 0.25, // This moves the halo 25% to the right
          yOffset: 0.00  // This keeps it vertically centered
        });
      }
    }
    // Cleanup function to destroy the effect when the component unmounts
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []); // Empty array ensures this effect runs only once
  return (
    <div className="min-h-screen bg-background text-notemon-text-main">
      <Navbar />
      
      {/* Hero Section */}
       <section 
        ref={vantaRef} 
        className="relative min-h-screen flex items-center justify-start text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex justify-start">
          <div className="animate-fade-in max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-notemon-text-main via-notemon-primary to-notemon-text-main bg-clip-text text-transparent">
                NoteMon
              </span>
              <br />
              <span className="text-notemon-text-main">
                Your AI-Powered Study Partner
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-notemon-text-secondary mb-8">
              Transform your study materials with intelligent summaries, interactive chat, and visual mindmaps. 
              Learn smarter, not harder with the power of artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary hover:bg-notemon-primary-hover text-white shadow-glow px-8 py-6 text-lg font-semibold">
                  Sign Up for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-notemon-surface text-notemon-text-main hover:bg-notemon-surface/20 px-8 py-6 text-lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-notemon-text-main">
              Powerful AI Tools for Learning
            </h2>
            <p className="text-lg text-notemon-text-secondary max-w-3xl mx-auto">
              Hover over a feature to explore our comprehensive suite of AI-powered tools.
            </p>
          </div>
          
          {/* Feature Titles */}
          <div className="flex justify-center">
            <div className="flex w-full max-w-5xl justify-center space-x-1 sm:space-x-2 lg:space-x-4 overflow-x-auto p-2 scrollbar-hide">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                  className={`flex-shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all duration-300 border-2 ${
                    activeFeature === index
                      ? 'bg-gradient-primary text-white shadow-glow border-transparent'
                      : 'bg-notemon-surface/50 text-notemon-text-secondary hover:bg-notemon-surface/80 border-notemon-surface hover:border-notemon-primary'
                  }`}
                >
                  {feature.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Feature Display Card */}
          <div className="mt-8">
             <Card className="chasing-border-card relative overflow-hidden mx-auto max-w-3xl bg-notemon-surface/30 border-notemon-surface p-8 transition-all duration-300 min-h-[250px] flex items-center">
              {/* Content Wrapper */}
              <div className="relative z-10 w-full">
                <div key={activeFeature} className="flex flex-col sm:flex-row items-center gap-8 animate-fade-in w-full">
                  <div className="flex-shrink-0 p-4 bg-gradient-primary rounded-xl w-fit shadow-glow">
                    {React.createElement(features[activeFeature].icon, { className: "h-10 w-10 sm:h-12 sm:w-12 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-notemon-text-main text-center sm:text-left">
                      {features[activeFeature].title}
                    </h3>
                    <p className="text-notemon-text-secondary leading-relaxed text-lg text-center sm:text-left">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-surface rounded-2xl p-8 sm:p-12 border border-notemon-surface">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-notemon-text-main">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-notemon-text-secondary mb-12 max-w-3xl mx-auto">
              Unlock powerful insights from your study materials in three simple steps.
            </p>

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
              {howItWorksSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div
                    className="flex flex-col items-center text-center max-w-xs animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Icon wrapper now uses the animated gradient background */}
                    <div className="p-4 rounded-full mb-4 animated-gradient-background">
                      {/* Icon itself needs a higher z-index to appear above the animated background */}
                      <step.icon
                        className="relative z-10 h-10 w-10 text-white animate-icon-pulse"
                        style={{ animationDelay: `${index * 0.2 + 0.5}s` }}/>
                    </div>
                    <h3 className="text-xl font-semibold text-notemon-text-main mb-2">{step.title}</h3>
                    <p className="text-notemon-text-secondary">{step.description}</p>
                  </div>

                  {index < howItWorksSteps.length - 1 && (
                     <ArrowRight
                       className="h-8 w-8 text-notemon-primary/50 shrink-0 rotate-90 md:rotate-0 animate-fade-in"
                       style={{ animationDelay: `${index * 0.2 + 0.2}s` }}
                     />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div
              className="mt-12 animate-fade-in"
              style={{ animationDelay: `0.8s` }}
            >
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-notemon-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold">
                  Start Learning Today
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
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
          <Link to="/signup">
            <Button className="bg-gradient-primary hover:bg-notemon-primary-hover text-white">
              Try NoteMon for Free
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;