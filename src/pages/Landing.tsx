
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Database, Zap, Users, Mail, Github, Linkedin, Twitter, DollarSign, TrendingUp, Target, Rocket } from 'lucide-react';
import Logo from '@/components/Logo';
import AnimatedCharacters from '@/components/landing/AnimatedCharacters';
import SplashScreen from '@/components/landing/SplashScreen';
import LoadingTransition from '@/components/landing/LoadingTransition';

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const handleGetStarted = () => {
    setShowLoading(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showLoading) {
    return <LoadingTransition />;
  }

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
              <a href="#docs" className="text-sm hover:text-neon-blue transition-colors">Documentation</a>
              <a href="#investors" className="text-sm hover:text-neon-blue transition-colors">Investors</a>
              <a href="#contact" className="text-sm hover:text-neon-blue transition-colors">Contact</a>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90">
                Launch App <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/30 text-neon-green">
                  🚀 Pre-Seed Funding Round Open
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                    Transform Data
                  </span>
                  <br />
                  <span className="text-white">Into Intelligence</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  AI-powered analytics platform that turns complex data into actionable insights with natural language queries and machine learning models.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90">
                  <Brain className="w-5 h-5 mr-2" />
                  Try Free Demo
                </Button>
                <Button variant="outline" size="lg" className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10">
                  <a href="#investors" className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Investment Opportunity
                  </a>
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span>Pre-Seed Round</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                  <span>$500K - $1M Target</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <AnimatedCharacters />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-cyber-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to transform your data into actionable insights with AI-powered analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analytics",
                description: "Natural language queries that understand your data and provide intelligent insights automatically.",
                color: "neon-blue"
              },
              {
                icon: Database,
                title: "Smart Data Processing",
                description: "Automated data cleaning, validation, and preprocessing to ensure high-quality analysis.",
                color: "neon-purple"
              },
              {
                icon: Zap,
                title: "Real-time Insights",
                description: "Live dashboards and instant analytics that update as your data changes.",
                color: "neon-green"
              },
              {
                icon: TrendingUp,
                title: "ML Models",
                description: "Built-in machine learning models for prediction, clustering, and anomaly detection.",
                color: "neon-pink"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share insights, create reports, and collaborate on data analysis with your team.",
                color: "neon-blue"
              },
              {
                icon: Target,
                title: "Custom Workflows",
                description: "Build automated data pipelines and custom analysis workflows for your specific needs.",
                color: "neon-purple"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-cyber-dark/50 border-white/10 hover:border-neon-blue/30 transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-${feature.color}/20 to-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                Getting Started
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Learn how to use QueryHive AI with our comprehensive documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Quick Start Guide",
                description: "Get up and running with QueryHive AI in minutes",
                topics: ["Account Setup", "Data Upload", "First Analysis", "Basic Queries"]
              },
              {
                title: "AI Chat Assistant",
                description: "Learn to interact with your data using natural language",
                topics: ["Query Syntax", "Advanced Questions", "Model Selection", "Export Results"]
              },
              {
                title: "Dashboard & Visualizations",
                description: "Create stunning visualizations and interactive dashboards",
                topics: ["Chart Types", "Custom Dashboards", "Real-time Updates", "Sharing"]
              },
              {
                title: "Machine Learning",
                description: "Leverage built-in ML models for advanced analytics",
                topics: ["Linear Regression", "Clustering", "Anomaly Detection", "Time Series"]
              },
              {
                title: "Data Processing",
                description: "Understand data cleaning and preparation workflows",
                topics: ["Data Quality", "Preprocessing", "Transformations", "Validation"]
              },
              {
                title: "API Integration",
                description: "Integrate QueryHive AI with your existing systems",
                topics: ["REST API", "Webhooks", "Authentication", "Rate Limits"]
              }
            ].map((doc, index) => (
              <Card key={index} className="bg-cyber-dark/30 border-white/10 hover:border-neon-green/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {doc.topics.map((topic, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <ArrowRight className="w-3 h-3 mr-2 text-neon-green" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="bg-cyber-dark/50 border-neon-green/20">
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

              <Card className="bg-cyber-dark/50 border-neon-blue/20">
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
            </div>

            <div className="space-y-8">
              <Card className="bg-cyber-dark/50 border-neon-purple/20">
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

              <Card className="bg-cyber-dark/50 border-neon-pink/20">
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
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-cyber-dark/30 border-neon-blue/20 text-center">
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

            <Card className="bg-cyber-dark/30 border-neon-green/20 text-center">
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

            <Card className="bg-cyber-dark/30 border-neon-purple/20 text-center">
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
          </div>

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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
