import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Send, User, Settings, Star, BookOpen, Upload, Sparkles, Lightbulb } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels, type MLModelType } from '@/hooks/useMLModels';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useAchievements } from '@/hooks/useAchievements';
import { supabase } from '@/integrations/supabase/client';
import MarkdownRenderer from './MarkdownRenderer';
import FeedbackSystem from './FeedbackSystem';
import LoadingSpinner from './LoadingSpinner';
import EnhancedLoadingSpinner from './EnhancedLoadingSpinner';
import EmptyState from './EmptyState';
import { useA11y } from './a11y/A11yProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { SparkleEffect } from './MicroInteractions';
import AIAssistantPersona from './AIAssistantPersona';
import type { ChatMessage, MLResultMetadata } from '@/types';
import { toast } from 'sonner';
import confetti from '@/lib/confetti';

const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `# 🤖 Advanced AI Analytics Assistant

Welcome to your **enhanced AI assistant** powered by:

## 🧠 **Intelligent Features**
- **Knowledge Graph**: Discover relationships in your data
- **Self-Learning**: Adapts to your preferences over time  
- **RLHF**: Improves through your feedback
- **Context Memory**: Remembers our conversation
- **Knowledge Base**: Learns from your insights

## 🔬 **ML Capabilities**
- Linear Regression Analysis
- Clustering & Segmentation  
- Anomaly Detection
- Time Series Forecasting

## 📊 **What I Can Help With**
- Analyze data patterns and trends
- Generate personalized insights
- Create interactive visualizations
- Process and clean your data
- Build knowledge graphs from your data

*Ready to explore your data together? Upload a dataset to unlock my full potential!*`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<MLModelType>('linear_regression');
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showSparkle, setShowSparkle] = useState(false);
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 });
  const [personalizedSuggestion, setPersonalizedSuggestion] = useState<string | null>(null);
  
  const { analyzeData, isLoading } = useAI();
  const { datasets } = useDatasets();
  const { runMLAnalysis, insights, isRunningAnalysis } = useMLModels();
  const { getPersonalizedRecommendations, submitFeedback } = useLearningSystem();
  const { searchKnowledge, addEntry } = useKnowledgeBase();
  const { unlockAchievement } = useAchievements();
  const { announce } = useA11y();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get personalized suggestions when component mounts
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (datasets.length === 0) return;
      
      try {
        const result = await getPersonalizedRecommendations.mutateAsync({
          context: { 
            datasets: datasets.map(d => d.name),
            recentActivity: 'viewing_ai_chat'
          }
        });
        
        if (result.recommendations.length > 0) {
          // Pick a random suggestion from the top 3 recommendations
          const randomIndex = Math.floor(Math.random() * Math.min(3, result.recommendations.length));
          setPersonalizedSuggestion(result.recommendations[randomIndex].title);
        }
      } catch (error) {
        console.error('Error fetching personalized suggestions:', error);
      }
    };
    
    fetchSuggestions();
  }, [datasets, getPersonalizedRecommendations]);

  const handleRunMLModel = async () => {
    if (!datasets.length) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: '⚠️ **No datasets available.** Please upload data first before running ML analysis.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      announce('No datasets available. Please upload data first before running ML analysis.', 'assertive');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `🔬 **Running ${selectedModel.replace('_', ' ')} analysis** on dataset "${datasets[0].name}"`,
      timestamp: new Date(),
      modelType: selectedModel
    };
    setMessages(prev => [...prev, userMessage]);
    announce(`Running ${selectedModel.replace('_', ' ')} analysis on dataset ${datasets[0].name}`, 'polite');

    try {
      const result = await runMLAnalysis.mutateAsync({
        datasetId: datasets[0].id,
        modelType: selectedModel,
        parameters: {}
      });

      // Store successful analysis in knowledge base
      await addEntry.mutateAsync({
        title: `${selectedModel.replace('_', ' ')} Analysis Result`,
        content: `Analysis of ${datasets[0].name}: ${result.description}`,
        category: 'ml_analysis',
        tags: [selectedModel, 'analysis', 'insights']
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `## ✅ **${result.title}**

${result.description}

### 📊 **Analysis Details**
**Confidence:** ${result.confidence ? (result.confidence * 100).toFixed(1) + '%' : 'N/A'}

${formatMLResults(result.metadata)}

### 💡 **Insights**
This analysis has been saved to your knowledge base for future reference.`,
        timestamp: new Date(),
        modelType: selectedModel,
        metadata: result.metadata
      };
      setMessages(prev => [...prev, aiMessage]);
      announce(`Analysis complete: ${result.title}`, 'polite');
      
      // Show success animation
      triggerSparkleEffect();
      
      // Trigger confetti for successful analysis
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
      
      // Unlock achievement for first ML model
      try {
        await unlockAchievement.mutateAsync('first_ml_model');
      } catch (error) {
        console.error('Error unlocking achievement:', error);
      }

    } catch (error) {
      console.error('ML analysis failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `## ❌ **Analysis Failed**

Sorry, the **${selectedModel.replace('_', ' ')} analysis** encountered an error:

\`\`\`
${error instanceof Error ? error.message : 'Unknown error occurred'}
\`\`\`

### 🔧 **Troubleshooting**
- Check your data format
- Try a different model
- Ensure sufficient data points`,
        timestamp: new Date(),
        modelType: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
      announce(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, 'assertive');
    }
  };

  const formatMLResults = (metadata: MLResultMetadata): string => {
    if (!metadata) return '*No additional details available.*';
    
    if (metadata.equation) {
      return `**Equation:** \`y = ${metadata.equation.slope?.toFixed(3)}x + ${metadata.equation.intercept?.toFixed(3)}\`
**R-squared:** \`${metadata.rSquared?.toFixed(3)}\`  
**Data Points:** \`${metadata.dataPoints}\``;
    }
    
    if (metadata.clusters) {
      return `**Clusters Found:** \`${metadata.clusters.length}\`
**Largest Cluster:** \`${Math.max(...metadata.clusters.map((c) => c.count))} points\`
**Total Points:** \`${metadata.totalPoints}\``;
    }
    
    if (metadata.anomalies) {
      return `**Total Anomalies:** \`${metadata.totalAnomalies}\`
**Variables Checked:** \`${metadata.anomalies.length}\`
**Threshold:** \`${metadata.threshold} standard deviations\``;
    }
    
    if (metadata.trend) {
      return `**Trend Direction:** \`${metadata.trend.direction}\`
**Change Magnitude:** \`${metadata.trend.strength?.toFixed(1)}%\`
**Data Points:** \`${metadata.dataPoints}\``;
    }
    
    return '*Analysis completed successfully.*';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    announce(`Sent query: ${currentInput}`, 'polite');

    try {
      // Get personalized recommendations first
      let recommendations = null;
      try {
        const recResult = await getPersonalizedRecommendations.mutateAsync({
          context: { query: currentInput, datasets: datasets.map(d => d.name) }
        });
        recommendations = recResult;
      } catch (error) {
        console.log('No personalized recommendations available');
      }

      // Search knowledge base for relevant context
      let knowledgeContext = null;
      try {
        const searchResult = await searchKnowledge.mutateAsync({ query: currentInput });
        knowledgeContext = searchResult;
      } catch (error) {
        console.log('Knowledge search unavailable');
      }

      // Get the latest dataset for context
      const latestDataset = datasets[0];
      let contextData: Record<string, any>[] = [];
      
      if (latestDataset) {
        const { data: records } = await supabase
          .from('data_records')
          .select('data')
          .eq('dataset_id', latestDataset.id)
          .limit(100);
        
        if (records && records.length > 0) {
          contextData = records.map(r => r.data);
        } else {
          contextData = [{
            dataset_name: latestDataset.name,
            columns: latestDataset.columns_info,
            row_count: latestDataset.row_count,
          }];
        }
      }

      announce('Processing your query...', 'polite');
      const result = await analyzeData.mutateAsync({
        query: currentInput,
        data: contextData,
        type: 'enhanced_analysis',
        modelType: selectedModel
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
        modelType: selectedModel
      };

      setMessages(prev => [...prev, aiMessage]);
      announce('Response received', 'polite');
      
      // Show success animation
      triggerSparkleEffect();

      // Auto-save valuable insights to knowledge base
      if (result.confidence && result.confidence > 0.8) {
        await addEntry.mutateAsync({
          title: `AI Insight: ${currentInput.substring(0, 50)}...`,
          content: result.response,
          category: 'ai_insights',
          tags: ['auto-generated', 'high-confidence']
        });
      }
      
      // Unlock achievement for first query
      try {
        await unlockAchievement.mutateAsync('first_query');
      } catch (error) {
        console.error('Error unlocking achievement:', error);
      }

    } catch (error) {
      console.error('AI Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `## ⚠️ **Processing Error**

I encountered an error while processing your request:

### 🔍 **Possible Causes**
- API configuration issues
- No data uploaded yet  
- Network connectivity problems
- Service temporarily unavailable

### 💡 **Next Steps**
1. Ensure you have uploaded some data
2. Check your internet connection
3. Try again in a moment
4. Contact support if the issue persists`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      announce('Error processing your request', 'assertive');
    }
  };

  const handleQuickAction = async (action: string) => {
    let query = '';
    
    switch (action) {
      case 'analyze_trends':
        query = 'Analyze the trends and patterns in my data. What insights can you find?';
        break;
      case 'find_anomalies':
        query = 'Help me identify anomalies or outliers in the data. What looks unusual?';
        setSelectedModel('anomaly_detection');
        break;
      case 'predict_future':
        query = 'Based on historical data, what predictions can you make about future trends?';
        setSelectedModel('time_series');
        break;
      case 'segment_data':
        query = 'Can you help me segment or cluster this data to find natural groupings?';
        setSelectedModel('clustering');
        break;
      case 'correlations':
        query = 'What correlations or relationships exist between different variables in my data?';
        setSelectedModel('linear_regression');
        break;
      case 'data_quality':
        query = 'Assess the quality of my data. Are there any issues I should address?';
        break;
      case 'build_knowledge':
        query = 'Build a knowledge graph from my data to discover hidden relationships.';
        break;
      case 'personalized_insights':
        query = 'What personalized insights do you have for me based on my analysis history?';
        break;
    }
    
    setInput(query);
    // Focus the input field
    inputRef.current?.focus();
    announce(`Selected query: ${query}`, 'polite');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { id: 'analyze_trends', label: 'Analyze Trends', icon: '📈' },
    { id: 'find_anomalies', label: 'Find Anomalies', icon: '🔍' },
    { id: 'predict_future', label: 'Predict Future', icon: '🔮' },
    { id: 'segment_data', label: 'Segment Data', icon: '🎯' },
    { id: 'correlations', label: 'Find Correlations', icon: '🔗' },
    { id: 'data_quality', label: 'Check Quality', icon: '✅' },
    { id: 'build_knowledge', label: 'Build Knowledge Graph', icon: '🕸️' },
    { id: 'personalized_insights', label: 'Personal Insights', icon: '💡' }
  ];

  const handleUploadClick = () => {
    // Find the upload tab trigger and click it
    const uploadTabTrigger = document.querySelector('[value="upload"]');
    if (uploadTabTrigger && uploadTabTrigger instanceof HTMLElement) {
      uploadTabTrigger.click();
    }
  };

  // Handle personalized suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // Trigger sparkle effect at a random position in the chat container
  const triggerSparkleEffect = () => {
    if (!chatContainerRef.current) return;
    
    const containerRect = chatContainerRef.current.getBoundingClientRect();
    const x = Math.random() * containerRect.width;
    const y = Math.random() * (containerRect.height / 2) + containerRect.height / 4;
    
    setSparklePosition({ x, y });
    setShowSparkle(true);
    
    // Hide sparkle after animation
    setTimeout(() => {
      setShowSparkle(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* AI Assistant Persona - only show if we have datasets */}
      {datasets.length > 0 && personalizedSuggestion && (
        <AIAssistantPersona onSuggestionClick={handleSuggestionClick} />
      )}
      
      <Card className="glass-effect h-[600px] flex flex-col relative" role="region" aria-label="AI Chat Assistant" ref={chatContainerRef}>
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold flex items-center" id="ai-chat-heading">
            <Brain className="w-5 h-5 mr-2 text-neon-purple" aria-hidden="true" />
            Enhanced AI Analytics Assistant
          </h3>
          <p className="text-sm text-muted-foreground">
            🧠 Self-Learning • 📚 Knowledge Base • 🕸️ Knowledge Graph • ⭐ RLHF Enhanced
          </p>
          
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Model:</span>
            <Select 
              value={selectedModel} 
              onValueChange={(value: MLModelType) => {
                setSelectedModel(value);
                announce(`Selected model: ${value.replace('_', ' ')}`, 'polite');
              }}
              aria-label="Select ML model"
            >
              <SelectTrigger className="w-36 h-8 glass-effect text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear_regression">Linear Regression</SelectItem>
                <SelectItem value="clustering">Clustering</SelectItem>
                <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                <SelectItem value="time_series">Time Series</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs glass-effect border-neon-blue/30 hover:border-neon-blue/50"
              onClick={handleRunMLModel}
              disabled={isRunningAnalysis || !datasets.length}
              aria-label={`Run ${selectedModel.replace('_', ' ')} model`}
            >
              {isRunningAnalysis ? (
                <EnhancedLoadingSpinner 
                  size="sm" 
                  messages={[
                    `Running ${selectedModel.replace('_', ' ')}...`,
                    "Processing data...",
                    "Analyzing patterns...",
                    "Generating insights..."
                  ]}
                />
              ) : (
                'Run Model'
              )}
            </Button>
          </div>
        </div>

        {datasets.length > 0 ? (
          <>
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 text-neon-yellow" aria-hidden="true" />
                <span className="text-xs text-muted-foreground">Enhanced Actions:</span>
              </div>
              <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Quick action buttons">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 glass-effect border-white/20 hover:border-neon-blue/50 transition-all duration-300 hover:scale-105"
                    onClick={() => handleQuickAction(action.id)}
                    aria-label={action.label}
                  >
                    <span className="mr-1" aria-hidden="true">{action.icon}</span>
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4" role="log" aria-label="Chat messages">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30'
                            : message.type === 'system'
                            ? 'bg-gradient-to-r from-neon-yellow/20 to-neon-orange/20 border border-neon-yellow/30'
                            : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-white/10'
                        }`}
                        role={message.type === 'ai' ? 'status' : 'none'}
                      >
                        <div className="flex items-start space-x-3">
                          {message.type === 'ai' ? (
                            <Brain className="w-5 h-5 mt-1 text-neon-purple flex-shrink-0" aria-hidden="true" />
                          ) : message.type === 'system' ? (
                            <Settings className="w-5 h-5 mt-1 text-neon-yellow flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <User className="w-5 h-5 mt-1 text-neon-blue flex-shrink-0" aria-hidden="true" />
                          )}
                          <div className="flex-1 min-w-0 text-left">
                            {message.type === 'user' ? (
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            ) : (
                              <MarkdownRenderer content={message.content} />
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-muted-foreground">
                                {formatTime(message.timestamp)}
                              </p>
                              <div className="flex items-center space-x-2">
                                {message.modelType && (
                                  <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                                    {message.modelType.replace('_', ' ')}
                                  </span>
                                )}
                                {message.type === 'ai' && (
                                  <FeedbackSystem
                                    interactionId={message.id}
                                    context={{
                                      modelType: message.modelType,
                                      sessionId,
                                      messageContent: message.content.substring(0, 100)
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(isLoading || isRunningAnalysis) && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-white/10">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-neon-purple" aria-hidden="true" />
                        <EnhancedLoadingSpinner 
                          size="sm" 
                          messages={[
                            "AI is thinking...",
                            "Analyzing your data...",
                            "Connecting patterns...",
                            "Generating insights...",
                            "Almost there..."
                          ]}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2" role="form" aria-label="Chat input form">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your data, request analysis, or run ML models..."
                  className="flex-1 glass-effect border-white/20 transition-all duration-300 focus:border-neon-blue/50 focus:shadow-sm focus:shadow-neon-blue/20"
                  disabled={isLoading}
                  ref={inputRef}
                  aria-label="Chat message input"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="cyber-button transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                {datasets.length > 0 
                  ? `🔗 Connected to ${datasets.length} dataset(s) • 💡 ${insights.length} insights • 🧠 Model: ${selectedModel.replace('_', ' ')}`
                  : '📂 Upload data to unlock full AI capabilities'
                }
                <BookOpen className="w-3 h-3 ml-2" aria-hidden="true" />
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <EmptyState
              title="No datasets available"
              description="Upload your first dataset to start using the AI assistant"
              icon={Upload}
              actionLabel="Upload Data"
              onAction={handleUploadClick}
              iconClassName="bg-neon-blue/10"
            />
          </div>
        )}
        
        {/* Sparkle effect for successful responses */}
        <AnimatePresence>
          {showSparkle && (
            <motion.div
              className="absolute pointer-events-none"
              style={{ 
                left: `${sparklePosition.x}px`, 
                top: `${sparklePosition.y}px`,
                zIndex: 10
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SparkleEffect 
                show={true} 
                color="purple" 
                size="md" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default AIChat;