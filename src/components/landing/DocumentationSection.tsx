import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Code, 
  Zap, 
  Database, 
  Brain, 
  Users, 
  Settings,
  ArrowRight,
  ExternalLink,
  Download,
  Play,
  FileText,
  Video,
  Lightbulb
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'guide' | 'tutorial' | 'reference' | 'video';
  tags: string[];
}

const documentationSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to begin your journey with QueryHive AI',
    icon: Zap,
    color: 'neon-blue',
    articles: [
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        description: 'Get up and running with QueryHive AI in under 5 minutes',
        readTime: '5 min',
        difficulty: 'Beginner',
        type: 'guide',
        tags: ['setup', 'basics', 'first-steps']
      },
      {
        id: 'first-analysis',
        title: 'Your First Data Analysis',
        description: 'Step-by-step tutorial for analyzing your first dataset',
        readTime: '10 min',
        difficulty: 'Beginner',
        type: 'tutorial',
        tags: ['tutorial', 'analysis', 'csv']
      },
      {
        id: 'interface-overview',
        title: 'Interface Overview',
        description: 'Complete walkthrough of the QueryHive AI interface',
        readTime: '8 min',
        difficulty: 'Beginner',
        type: 'video',
        tags: ['interface', 'navigation', 'overview']
      }
    ]
  },
  {
    id: 'ai-features',
    title: 'AI & Machine Learning',
    description: 'Harness the power of AI for advanced data analysis',
    icon: Brain,
    color: 'neon-purple',
    articles: [
      {
        id: 'natural-language',
        title: 'Natural Language Queries',
        description: 'Learn to ask questions about your data in plain English',
        readTime: '12 min',
        difficulty: 'Beginner',
        type: 'guide',
        tags: ['ai', 'queries', 'natural-language']
      },
      {
        id: 'ml-models',
        title: 'Machine Learning Models',
        description: 'Understanding and using built-in ML algorithms',
        readTime: '20 min',
        difficulty: 'Intermediate',
        type: 'tutorial',
        tags: ['ml', 'algorithms', 'analysis']
      },
      {
        id: 'knowledge-graph',
        title: 'Knowledge Graph Construction',
        description: 'Build and explore knowledge graphs from your data',
        readTime: '15 min',
        difficulty: 'Advanced',
        type: 'guide',
        tags: ['knowledge-graph', 'relationships', 'advanced']
      }
    ]
  },
  {
    id: 'data-management',
    title: 'Data Management',
    description: 'Best practices for uploading, cleaning, and organizing data',
    icon: Database,
    color: 'neon-green',
    articles: [
      {
        id: 'data-upload',
        title: 'Data Upload Best Practices',
        description: 'Optimize your CSV files for the best analysis results',
        readTime: '8 min',
        difficulty: 'Beginner',
        type: 'guide',
        tags: ['upload', 'csv', 'best-practices']
      },
      {
        id: 'data-cleaning',
        title: 'Automated Data Cleaning',
        description: 'How QueryHive AI cleans and prepares your data',
        readTime: '12 min',
        difficulty: 'Intermediate',
        type: 'tutorial',
        tags: ['cleaning', 'preprocessing', 'quality']
      },
      {
        id: 'data-pipelines',
        title: 'Data Processing Pipelines',
        description: 'Create automated workflows for data processing',
        readTime: '18 min',
        difficulty: 'Advanced',
        type: 'tutorial',
        tags: ['pipelines', 'automation', 'workflows']
      }
    ]
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together with your team on data analysis projects',
    icon: Users,
    color: 'neon-pink',
    articles: [
      {
        id: 'sharing-insights',
        title: 'Sharing Insights',
        description: 'Share your analysis results with team members',
        readTime: '6 min',
        difficulty: 'Beginner',
        type: 'guide',
        tags: ['sharing', 'collaboration', 'export']
      },
      {
        id: 'team-workspaces',
        title: 'Team Workspaces',
        description: 'Set up and manage collaborative workspaces',
        readTime: '10 min',
        difficulty: 'Intermediate',
        type: 'tutorial',
        tags: ['workspaces', 'teams', 'management']
      }
    ]
  },
  {
    id: 'api-integration',
    title: 'API & Integration',
    description: 'Integrate QueryHive AI with your existing systems',
    icon: Code,
    color: 'neon-yellow',
    articles: [
      {
        id: 'api-overview',
        title: 'API Overview',
        description: 'Introduction to the QueryHive AI REST API',
        readTime: '15 min',
        difficulty: 'Intermediate',
        type: 'reference',
        tags: ['api', 'rest', 'integration']
      },
      {
        id: 'webhooks',
        title: 'Webhooks & Events',
        description: 'Set up real-time notifications and triggers',
        readTime: '12 min',
        difficulty: 'Advanced',
        type: 'tutorial',
        tags: ['webhooks', 'events', 'real-time']
      }
    ]
  }
];

const DocumentationSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState(documentationSections[0]);
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(null);

  const filteredSections = documentationSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.articles.length > 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'tutorial': return Play;
      case 'reference': return FileText;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'neon-green';
      case 'Intermediate': return 'neon-yellow';
      case 'Advanced': return 'neon-red';
      default: return 'neon-blue';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Documentation & Guides
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guides, tutorials, and references to help you master QueryHive AI
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-effect border-white/20"
          />
        </div>
      </div>

      {/* Documentation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glass-effect border-white/10 sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-neon-blue" />
                Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isActive = selectedSection.id === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? `bg-${section.color}/10 border border-${section.color}/30 text-${section.color}` 
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? `text-${section.color}` : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.articles.length} articles</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedArticle ? (
            /* Article View */
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ← Back to {selectedSection.title}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-${getDifficultyColor(selectedArticle.difficulty)}/20 text-${getDifficultyColor(selectedArticle.difficulty)} border-${getDifficultyColor(selectedArticle.difficulty)}/30`}>
                      {selectedArticle.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-white/20">
                      {selectedArticle.readTime}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-2xl text-white mt-4">
                  {selectedArticle.title}
                </CardTitle>
                <p className="text-gray-400">{selectedArticle.description}</p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    This is where the full article content would be displayed. The article would include:
                  </p>
                  <ul className="text-gray-300">
                    <li>Step-by-step instructions with screenshots</li>
                    <li>Code examples and best practices</li>
                    <li>Interactive demos and examples</li>
                    <li>Troubleshooting tips and common issues</li>
                    <li>Related articles and next steps</li>
                  </ul>
                  
                  <div className="mt-8 p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-neon-blue" />
                      <span className="text-neon-blue font-medium">Pro Tip</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      This would contain helpful tips and advanced techniques related to the article topic.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" className="border-white/20">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="border-white/20">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: 2 days ago
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Section View */
            <div className="space-y-6">
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-${selectedSection.color}/20 flex items-center justify-center`}>
                      <selectedSection.icon className={`w-6 h-6 text-${selectedSection.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">{selectedSection.title}</CardTitle>
                      <p className="text-gray-400 mt-1">{selectedSection.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedSection.articles.map((article) => {
                  const TypeIcon = getTypeIcon(article.type);
                  
                  return (
                    <Card
                      key={article.id}
                      className="glass-effect border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-${selectedSection.color}/20 flex items-center justify-center`}>
                              <TypeIcon className={`w-5 h-5 text-${selectedSection.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-white group-hover:text-neon-blue transition-colors">
                                {article.title}
                              </CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`bg-${getDifficultyColor(article.difficulty)}/20 text-${getDifficultyColor(article.difficulty)} border-${getDifficultyColor(article.difficulty)}/30 text-xs`}>
                                  {article.difficulty}
                                </Badge>
                                <span className="text-xs text-gray-500">{article.readTime}</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-neon-blue transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4">
                          {article.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-white/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationSection;