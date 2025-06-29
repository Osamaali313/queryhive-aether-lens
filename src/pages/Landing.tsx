import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Brain, 
  Database, 
  Zap, 
  Users, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Rocket, 
  Play, 
  Star, 
  Sparkles,
  Code,
  Server,
  Shield,
  Cpu,
  Layers,
  Heart,
  Award,
  Lightbulb,
  Compass,
  Briefcase,
  Clock,
  CheckCircle
} from 'lucide-react';
import Logo from '@/components/Logo';
import AnimatedCharacters from '@/components/landing/AnimatedCharacters';
import SplashScreen from '@/components/landing/SplashScreen';
import LoadingTransition from '@/components/landing/LoadingTransition';
import AnimatedWorkflow from '@/components/landing/AnimatedWorkflow';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import DocumentationSection from '@/components/landing/DocumentationSection';
import InteractiveTour from '@/components/landing/InteractiveTour';
import { motion } from 'framer-motion';

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowLoading(true);
    // Navigate to auth page after loading animation
    setTimeout(() => {
      navigate('/auth');
    }, 3000);
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleLaunchApp = () => {
    navigate('/app');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showLoading) {
    return <LoadingTransition />;
  }

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-radial from-neon-blue/5 via-transparent to-neon-purple/5 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-50 bg-cyber-dark/80 backdrop-blur-sm border-b border-neon-blue/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size="md" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  QueryHive AI
                </h1>
                <p className="text-xs text-muted-foreground">Intelligent Data Analytics</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm hover:text-neon-blue transition-colors">Features</a>
              <a href="#workflow" className="text-sm hover:text-neon-blue transition-colors">How It Works</a>
              <a href="#story" className="text-sm hover:text-neon-blue transition-colors">Our Story</a>
              <a href="#tech" className="text-sm hover:text-neon-blue transition-colors">Technology</a>
              <a href="#investors" className="text-sm hover:text-neon-blue transition-colors">Investors</a>
              <a href="#contact" className="text-sm hover:text-neon-blue transition-colors">Contact</a>
              <Button onClick={handleStartTour} variant="outline" className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10">
                <Play className="w-4 h-4 mr-2" />
                Take Tour
              </Button>
              <Button onClick={handleLaunchApp} variant="outline" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                Launch App
              </Button>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Bolt Badge */}
      <a 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-4 right-4 z-50 md:top-6 md:right-6 transition-transform hover:scale-105"
        aria-label="Powered by Bolt.new"
      >
        <img 
          src="/image.png" 
          alt="Powered by Bolt.new" 
          className="w-16 h-16 md:w-20 md:h-20"
        />
      </a>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/30 text-neon-green animate-pulse">
                  🚀 AI-Powered Analytics Platform
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-glow">
                    Transform Data
                  </span>
                  <br />
                  <span className="text-white">Into Intelligence</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Ask questions in natural language, get AI-powered insights, and discover patterns in your data with our revolutionary analytics platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 animate-pulse">
                  <Brain className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button onClick={handleStartTour} variant="outline" size="lg" className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10">
                  <Play className="w-5 h-5 mr-2" />
                  Interactive Tour
                </Button>
                <Button onClick={handleLaunchApp} variant="outline" size="lg" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Launch App
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span>No Code Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                  <span>Enterprise Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
                  <span>Real-time Insights</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <AnimatedCharacters />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-20 bg-cyber-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border-neon-purple/30 text-neon-purple mb-4">
              ⚡ Powered by AI
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                How QueryHive AI Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From data upload to actionable insights in minutes, not hours
            </p>
          </div>

          <AnimatedWorkflow />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-green/20 border-neon-blue/30 text-neon-blue mb-4">
              🧠 AI-Powered Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to transform your data into actionable insights
            </p>
          </div>

          <FeatureShowcase />
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 bg-cyber-light/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 border-neon-pink/30 text-neon-pink mb-4">
              💫 Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                The QueryHive AI Story
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Born from a passion to democratize data intelligence for everyone
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="glass-effect border-neon-pink/20 hover:border-neon-pink/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-pink">
                    <Compass className="w-5 h-5 mr-2" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    We believe that powerful data analytics shouldn't require a PhD in data science. 
                    QueryHive AI makes advanced analytics accessible to everyone through natural language 
                    interfaces and intelligent automation, empowering businesses of all sizes to make 
                    data-driven decisions with confidence.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-blue">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    We envision a world where every business decision is backed by intelligent data analysis, 
                    where insights are instant, and where the power of AI serves human creativity 
                    and innovation. QueryHive AI is building that future today, one insight at a time.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-neon-green/20 hover:border-neon-green/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <Heart className="w-5 h-5 mr-2" />
                    Our Values
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-neon-green rounded-full mr-3 flex-shrink-0"></div>
                      <span><strong className="text-neon-green">Accessibility:</strong> Making AI analytics available to everyone, regardless of technical background</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-neon-green rounded-full mr-3 flex-shrink-0"></div>
                      <span><strong className="text-neon-green">Privacy:</strong> Ensuring your data remains yours with enterprise-grade security</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-neon-green rounded-full mr-3 flex-shrink-0"></div>
                      <span><strong className="text-neon-green">Innovation:</strong> Continuously pushing the boundaries of what's possible with AI</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-neon-green rounded-full mr-3 flex-shrink-0"></div>
                      <span><strong className="text-neon-green">Transparency:</strong> Building trust through explainable AI and clear communication</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="glass-effect border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-purple">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Our Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Founded by a team of data scientists, AI researchers, and business leaders who saw 
                    firsthand how difficult it was for non-technical teams to leverage the power of their data.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-neon-purple/10 rounded-lg">
                      <p className="text-2xl font-bold text-neon-purple">15+</p>
                      <p className="text-sm text-gray-400">Years in AI Research</p>
                    </div>
                    <div className="p-4 bg-neon-blue/10 rounded-lg">
                      <p className="text-2xl font-bold text-neon-blue">50+</p>
                      <p className="text-sm text-gray-400">ML Models Developed</p>
                    </div>
                    <div className="p-4 bg-neon-green/10 rounded-lg">
                      <p className="text-2xl font-bold text-neon-green">12+</p>
                      <p className="text-sm text-gray-400">Industry Experts</p>
                    </div>
                    <div className="p-4 bg-neon-pink/10 rounded-lg">
                      <p className="text-2xl font-bold text-neon-pink">3+</p>
                      <p className="text-sm text-gray-400">Successful Startups</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-neon-yellow/20 hover:border-neon-yellow/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-yellow">
                    <Award className="w-5 h-5 mr-2" />
                    Our Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-yellow mr-3 flex-shrink-0 mt-0.5" />
                      <span>Developed proprietary natural language processing system that understands complex data queries with 94% accuracy</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-yellow mr-3 flex-shrink-0 mt-0.5" />
                      <span>Created knowledge graph technology that automatically discovers relationships in data 5x faster than traditional methods</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-yellow mr-3 flex-shrink-0 mt-0.5" />
                      <span>Pioneered self-learning AI system that improves with every user interaction</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-effect border-neon-orange/20 hover:border-neon-orange/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-orange">
                    <Clock className="w-5 h-5 mr-2" />
                    Our Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-12 text-right mr-4 text-neon-orange font-bold">2022</div>
                      <div className="flex-1 pb-4 border-l-2 border-neon-orange/30 pl-4">
                        <p className="text-white font-medium">Concept Development</p>
                        <p className="text-sm text-gray-400">Initial research and prototype development</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 text-right mr-4 text-neon-orange font-bold">2023</div>
                      <div className="flex-1 pb-4 border-l-2 border-neon-orange/30 pl-4">
                        <p className="text-white font-medium">Alpha Testing</p>
                        <p className="text-sm text-gray-400">First version tested with select partners</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 text-right mr-4 text-neon-orange font-bold">2024</div>
                      <div className="flex-1 pb-4 border-l-2 border-neon-orange/30 pl-4">
                        <p className="text-white font-medium">Public Launch</p>
                        <p className="text-sm text-gray-400">QueryHive AI opens to the public</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 text-right mr-4 text-neon-orange font-bold">2025</div>
                      <div className="flex-1 border-l-2 border-neon-orange/30 pl-4">
                        <p className="text-white font-medium">Global Expansion</p>
                        <p className="text-sm text-gray-400">Expanding to enterprise customers worldwide</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="tech" className="py-20 bg-gradient-to-r from-cyber-dark to-cyber-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-green/20 border-neon-blue/30 text-neon-blue mb-4">
              ⚙️ Cutting-Edge Stack
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
                Built With Modern Technology
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform leverages the latest advancements in AI, cloud computing, and web technologies
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Frontend Technologies */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-blue/20 h-full hover:border-neon-blue/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-blue">
                    <Code className="w-5 h-5 mr-2" />
                    Frontend Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/React-18.3.1-blue?style=flat&logo=react" alt="React" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">React 18</p>
                      <p className="text-xs text-gray-400">Modern UI library with concurrent rendering</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=flat&logo=typescript" alt="TypeScript" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">TypeScript</p>
                      <p className="text-xs text-gray-400">Type-safe development for robust code</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Tailwind-3.4.11-blue?style=flat&logo=tailwindcss" alt="Tailwind" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Tailwind CSS</p>
                      <p className="text-xs text-gray-400">Utility-first CSS framework for rapid UI development</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Framer_Motion-11.0.8-blue?style=flat&logo=framer" alt="Framer Motion" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Framer Motion</p>
                      <p className="text-xs text-gray-400">Production-ready animation library</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Vite-5.4.1-blue?style=flat&logo=vite" alt="Vite" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Vite</p>
                      <p className="text-xs text-gray-400">Next-generation frontend tooling</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Backend Technologies */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-green/20 h-full hover:border-neon-green/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <Server className="w-5 h-5 mr-2" />
                    Backend Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Supabase-2.50.0-green?style=flat&logo=supabase" alt="Supabase" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Supabase</p>
                      <p className="text-xs text-gray-400">Open source Firebase alternative</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/PostgreSQL-15-green?style=flat&logo=postgresql" alt="PostgreSQL" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">PostgreSQL</p>
                      <p className="text-xs text-gray-400">Advanced open source database</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Edge_Functions-Deno-green?style=flat&logo=deno" alt="Edge Functions" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Edge Functions</p>
                      <p className="text-xs text-gray-400">Serverless functions for AI processing</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Row_Level_Security-RLS-green?style=flat&logo=shield" alt="RLS" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Row Level Security</p>
                      <p className="text-xs text-gray-400">Database-level access control</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/TanStack_Query-5.56.2-green?style=flat&logo=react" alt="TanStack Query" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">TanStack Query</p>
                      <p className="text-xs text-gray-400">Data fetching and state management</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Technologies */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-purple/20 h-full hover:border-neon-purple/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-purple">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/NLP-Advanced-purple?style=flat&logo=openai" alt="NLP" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Natural Language Processing</p>
                      <p className="text-xs text-gray-400">Query understanding and response generation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Machine_Learning-Custom_Models-purple?style=flat&logo=tensorflow" alt="ML" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Machine Learning Models</p>
                      <p className="text-xs text-gray-400">Regression, clustering, anomaly detection</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Knowledge_Graph-Proprietary-purple?style=flat&logo=neo4j" alt="Knowledge Graph" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Knowledge Graph</p>
                      <p className="text-xs text-gray-400">Relationship discovery and mapping</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/RLHF-Self_Learning-purple?style=flat&logo=openai" alt="RLHF" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Reinforcement Learning</p>
                      <p className="text-xs text-gray-400">System that learns from human feedback</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                      <img src="https://img.shields.io/badge/Vector_Search-Embeddings-purple?style=flat&logo=postgresql" alt="Vector Search" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Vector Search</p>
                      <p className="text-xs text-gray-400">Semantic search for knowledge base</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Architecture */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-pink/20 h-full hover:border-neon-pink/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-pink">
                    <Layers className="w-5 h-5 mr-2" />
                    Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative p-4 border border-neon-pink/30 rounded-lg bg-neon-pink/5 mb-4">
                    <div className="absolute -top-3 left-4 bg-cyber-dark px-2 text-neon-pink text-sm font-medium">
                      Frontend Layer
                    </div>
                    <ul className="text-sm text-gray-300 space-y-2 mt-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>React components with TypeScript</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>TanStack Query for data fetching</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>Tailwind CSS for styling</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="relative p-4 border border-neon-pink/30 rounded-lg bg-neon-pink/5 mb-4">
                    <div className="absolute -top-3 left-4 bg-cyber-dark px-2 text-neon-pink text-sm font-medium">
                      Backend Layer
                    </div>
                    <ul className="text-sm text-gray-300 space-y-2 mt-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>Supabase for auth and database</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>Edge Functions for serverless compute</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>PostgreSQL with RLS for data security</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="relative p-4 border border-neon-pink/30 rounded-lg bg-neon-pink/5">
                    <div className="absolute -top-3 left-4 bg-cyber-dark px-2 text-neon-pink text-sm font-medium">
                      AI Layer
                    </div>
                    <ul className="text-sm text-gray-300 space-y-2 mt-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>Custom ML models for data analysis</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>NLP for query understanding</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></div>
                        <span>Knowledge graph for relationship mapping</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-yellow/20 h-full hover:border-neon-yellow/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-yellow">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-4">
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-lg bg-neon-yellow/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <Shield className="w-4 h-4 text-neon-yellow" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Row Level Security</p>
                        <p className="text-sm text-gray-400">Database-level access control ensures complete data isolation between users</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-lg bg-neon-yellow/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <Lock className="w-4 h-4 text-neon-yellow" />
                      </div>
                      <div>
                        <p className="font-medium text-white">End-to-End Encryption</p>
                        <p className="text-sm text-gray-400">All data is encrypted in transit and at rest</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-lg bg-neon-yellow/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <Eye className="w-4 h-4 text-neon-yellow" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Privacy by Design</p>
                        <p className="text-sm text-gray-400">Your data never leaves your account and is never used to train our models</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-lg bg-neon-yellow/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <FileCheck className="w-4 h-4 text-neon-yellow" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Compliance Ready</p>
                        <p className="text-sm text-gray-400">Built with GDPR, CCPA, and other regulatory requirements in mind</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-orange/20 h-full hover:border-neon-orange/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-orange">
                    <Cpu className="w-5 h-5 mr-2" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">Query Response Time</div>
                        <div className="text-xs text-neon-orange font-medium">45ms</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-neon-orange to-neon-yellow h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">ML Model Accuracy</div>
                        <div className="text-xs text-neon-orange font-medium">94.2%</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-neon-orange to-neon-yellow h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">Data Processing Rate</div>
                        <div className="text-xs text-neon-orange font-medium">1.2M rows/s</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-neon-orange to-neon-yellow h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">System Uptime</div>
                        <div className="text-xs text-neon-orange font-medium">99.9%</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-neon-orange to-neon-yellow h-2 rounded-full" style={{ width: '99.9%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-neon-orange/10 rounded-lg">
                      <p className="text-sm text-gray-300">
                        <span className="text-neon-orange font-medium">Performance Guarantee:</span> Our platform is optimized for speed and efficiency, with most queries returning results in under 100ms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 bg-cyber-light/5">
        <div className="container mx-auto px-4">
          <DocumentationSection />
        </div>
      </section>

      {/* Investors Section */}
      <section id="investors" className="py-20 bg-gradient-to-r from-cyber-dark to-cyber-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/30 text-neon-green mb-4">
              💰 Investment Opportunity
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                Join Our Pre-Seed Round
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're raising $500K - $1M to accelerate the development of the next-generation AI analytics platform
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <Card className="glass-effect border-neon-green/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <Rocket className="w-5 h-5 mr-2" />
                    Market Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Global Analytics Market</span>
                    <Badge className="bg-neon-green/20 text-neon-green">$274B by 2025</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Analytics Growth</span>
                    <Badge className="bg-neon-blue/20 text-neon-blue">23% CAGR</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Target Market Size</span>
                    <Badge className="bg-neon-purple/20 text-neon-purple">$45B SMB</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-neon-blue/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-blue">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    QueryHive AI democratizes advanced analytics by making AI-powered insights accessible to businesses of all sizes through natural language interfaces.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "No-code AI analytics platform",
                      "Natural language data queries",
                      "Automated ML model deployment",
                      "Real-time collaborative insights"
                    ].map((point, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <ArrowRight className="w-3 h-3 mr-2 text-neon-blue" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8">
              <Card className="glass-effect border-neon-purple/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-purple">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Funding Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-neon-green/10 rounded-lg">
                      <div className="text-2xl font-bold text-neon-green">$500K</div>
                      <div className="text-sm text-muted-foreground">Minimum</div>
                    </div>
                    <div className="text-center p-4 bg-neon-blue/10 rounded-lg">
                      <div className="text-2xl font-bold text-neon-blue">$1M</div>
                      <div className="text-sm text-muted-foreground">Target</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Use of Funds:</span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>• Product Development</span>
                        <span>40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Team Expansion</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Marketing & Sales</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Operations</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-neon-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-pink">
                    <Target className="w-5 h-5 mr-2" />
                    Key Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { milestone: "MVP Launch", status: "Completed", progress: "100%" },
                      { milestone: "Beta Testing", status: "In Progress", progress: "75%" },
                      { milestone: "Enterprise Features", status: "Q2 2024", progress: "25%" },
                      { milestone: "Series A Preparation", status: "Q4 2024", progress: "10%" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{item.milestone}</span>
                        <Badge className={`${
                          item.status === 'Completed' ? 'bg-neon-green/20 text-neon-green' :
                          item.status === 'In Progress' ? 'bg-neon-blue/20 text-neon-blue' :
                          'bg-neon-pink/20 text-neon-pink'
                        }`}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-neon-green to-neon-blue hover:opacity-90">
              <Mail className="w-5 h-5 mr-2" />
              Contact for Investment Details
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-cyber-light/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Ready to transform your data? Let's start the conversation.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-blue/20 text-center h-full">
                <CardHeader>
                  <Mail className="w-8 h-8 text-neon-blue mx-auto mb-4" />
                  <CardTitle>General Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Questions about our platform?</p>
                  <Button variant="outline" className="border-neon-blue/30 text-neon-blue">
                    hello@queryhive.ai
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-green/20 text-center h-full">
                <CardHeader>
                  <DollarSign className="w-8 h-8 text-neon-green mx-auto mb-4" />
                  <CardTitle>Investors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Interested in our funding round?</p>
                  <Button variant="outline" className="border-neon-green/30 text-neon-green">
                    investors@queryhive.ai
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-neon-purple/20 text-center h-full">
                <CardHeader>
                  <Users className="w-8 h-8 text-neon-purple mx-auto mb-4" />
                  <CardTitle>Partnership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Want to partner with us?</p>
                  <Button variant="outline" className="border-neon-purple/30 text-neon-purple">
                    partners@queryhive.ai
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="flex justify-center space-x-6 mt-12">
            <Button variant="ghost" size="icon" className="text-neon-blue hover:bg-neon-blue/10">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neon-blue hover:bg-neon-blue/10">
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neon-blue hover:bg-neon-blue/10">
              <Github className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyber-darker border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Logo size="sm" />
              <div>
                <div className="text-sm font-semibold text-white">QueryHive AI</div>
                <div className="text-xs text-muted-foreground">Intelligent Data Analytics</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 QueryHive AI. All rights reserved.
            </div>
            <a 
              href="https://bolt.new/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-4 md:mt-0"
              aria-label="Powered by Bolt.new"
            >
              <img 
                src="/image.png" 
                alt="Powered by Bolt.new" 
                className="w-16 h-16"
              />
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Tour */}
      <InteractiveTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
};

// Additional components for the Technology section
const Lock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const FileCheck = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M9 15l2 2 4-4"></path>
  </svg>
);

export default Landing;