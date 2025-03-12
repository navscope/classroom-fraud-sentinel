
import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { DetectionForm } from '@/components/DetectionForm';
import { Separator } from '@/components/ui/separator';
import { Shield, Monitor, BadgeCheck } from 'lucide-react';

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animElements = mainRef.current?.querySelectorAll('.anim-element');
    animElements?.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-4');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <main ref={mainRef} className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-2 animate-fade-in">
            Classroom Integrity Tool
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight anim-element transition-all duration-700 delay-100">
            AI Content Detection 
            <br /> for Classroom Assignments
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto anim-element transition-all duration-700 delay-200">
            Quickly identify potentially AI-generated content in student assignments with our 
            advanced detection tool. Upload files or paste text for instant analysis.
          </p>
        </div>
      </section>
      
      {/* Detection Form Section */}
      <section className="py-10 px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none"></div>
          <div className="glass-card rounded-xl p-6 md:p-8 subtle-shadow">
            <div className="text-center mb-8 anim-element transition-all duration-700 delay-300">
              <h2 className="text-2xl font-bold">Fraud Detection Tool</h2>
              <p className="text-muted-foreground mt-2">
                Upload an assignment file or paste text to analyze for AI-generated content
              </p>
            </div>
            
            <DetectionForm />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 anim-element transition-all duration-700">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Our detection system uses advanced algorithms to identify patterns 
              commonly found in AI-generated content
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card subtle-shadow anim-element transition-all duration-700 delay-100">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Detection</h3>
              <p className="text-muted-foreground">
                Our system analyzes linguistic patterns, syntactic structures, and stylistic 
                markers to identify AI-generated content.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card subtle-shadow anim-element transition-all duration-700 delay-200">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Get comprehensive analysis with highlighted suspicious passages and 
                confidence scores to make informed decisions.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card subtle-shadow anim-element transition-all duration-700 delay-300">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Educational Focus</h3>
              <p className="text-muted-foreground">
                Designed specifically for educational settings to help maintain academic 
                integrity in the age of AI writing tools.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-6 bg-secondary/30 mt-auto">
        <div className="max-w-5xl mx-auto">
          <Separator className="mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">FD</span>
              </div>
              <span className="font-medium">Fraud Sentinel</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} Classroom Fraud Sentinel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
