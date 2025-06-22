import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Send, User, Loader2, Lightbulb, Play, Settings, Star, BookOpen } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels, MLModelType } from '@/hooks/useMLModels';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { supabase } from '@/integrations/supabase/client';
import MarkdownRenderer from './MarkdownRenderer';
import FeedbackSystem from './FeedbackSystem';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  modelType?: string;
  metadata?: any;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
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
  
  const { analyzeData, isLoading } = useAI();
  const { datasets } = useDatasets();
  const { runMLAnalysis, insights, isRunningAnalysis } = useMLModels();
  const { getPersonalizedRecommendations } = useLearningSystem();
  const { searchKnowledge, addEntry } = useKnowledgeBase();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRunMLModel = async () => {
    if (!datasets.length) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: '⚠️ **No datasets available.** Please upload data first before running ML analysis.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `🔬 **Running ${selectedModel.replace('_', ' ')} analysis** on dataset "${datasets[0].name}"`,
      timestamp: new Date(),
      modelType: selectedModel
    };
    setMessages(prev => [...prev, userMessage]);

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

      const aiMessage: Message = {
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
        metadata: result
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('ML analysis failed:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `## ❌ **Analysis Failed**

Sorry, the **${selectedModel.replace('_', ' ')} analysis** encountered an error:

\`\`\`
${error.message}
\`\`\`

### 🔧 **Troubleshooting**
- Check your data format
- Try a different model
- Ensure sufficient data points`,
        timestamp: new Date(),
        modelType: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatMLResults = (metadata: any): string => {
    if (!metadata) return '*No additional details available.*';
    
    if (metadata.equation) {
      return `**Equation:** \`y = ${metadata.equation.slope?.toFixed(3)}x + ${metadata.equation.intercept?.toFixed(3)}\`
**R-squared:** \`${metadata.rSquared?.toFixed(3)}\`  
**Data Points:** \`${metadata.dataPoints}\``;
    }
    
    if (metadata.clusters) {
      return `**Clusters Found:** \`${metadata.clusters.length}\`
**Largest Cluster:** \`${Math.max(...metadata.clusters.map((c: any) => c.count))} points\`
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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

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
      let contextData = [];
      
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

      const result = await analyzeData.mutateAsync({
        query: currentInput,
        data: contextData,
        type: 'enhanced_analysis',
        modelType: selectedModel
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
        modelType: selectedModel
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-save valuable insights to knowledge base
      if (result.confidence && result.confidence > 0.8) {
        await addEntry.mutateAsync({
          title: `AI Insight: ${currentInput.substring(0, 50)}...`,
          content: result.response,
          category: 'ai_insights',
          tags: ['auto-generated', 'high-confidence']
        });
      }

    } catch (error) {
      console.error('AI Chat error:', error);
      
      const errorMessage: Message = {
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

  return (
    <Card className="glass-effect h-[600px] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold flex items-center">
          <Brain className="w-5 h-5 mr-2 text-neon-purple" />
          Enhanced AI Analytics Assistant
        </h3>
        <p className="text-sm text-muted-foreground">
          🧠 Self-Learning • 📚 Knowledge Base • 🕸️ Knowledge Graph • ⭐ RLHF Enhanced
        </p>
        
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Model:</span>
          <Select value={selectedModel} onValueChange={(value: MLModelType) => setSelectedModel(value)}>
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
          >
            <Play className="w-3 h-3 mr-1" />
            {isRunningAnalysis ? 'Running...' : 'Run Model'}
          </Button>
        </div>
      </div>

      {datasets.length > 0 && (
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-1 mb-2">
            <Lightbulb className="w-3 h-3 text-neon-yellow" />
            <span className="text-xs text-muted-foreground">Enhanced Actions:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2 glass-effect border-white/20 hover:border-neon-blue/50"
                onClick={() => handleQuickAction(action.id)}
              >
                <span className="mr-1">{action.icon}</span>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
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
              >
                <div className="flex items-start space-x-3">
                  {message.type === 'ai' ? (
                    <Brain className="w-5 h-5 mt-1 text-neon-purple flex-shrink-0" />
                  ) : message.type === 'system' ? (
                    <Settings className="w-5 h-5 mt-1 text-neon-yellow flex-shrink-0" />
                  ) : (
                    <User className="w-5 h-5 mt-1 text-neon-blue flex-shrink-0" />
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
            </div>
          ))}
          {(isLoading || isRunningAnalysis) && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-white/10">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-neon-purple" />
                  <Loader2 className="w-4 h-4 animate-spin text-neon-purple" />
                  <span className="text-sm text-muted-foreground">
                    {isRunningAnalysis 
                      ? `🔬 Running ${selectedModel.replace('_', ' ')} analysis...`
                      : `🧠 AI is analyzing with enhanced intelligence...`
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your data, request analysis, or run ML models..."
            className="flex-1 glass-effect border-white/20"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="cyber-button"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center">
          {datasets.length > 0 
            ? `🔗 Connected to ${datasets.length} dataset(s) • 💡 ${insights.length} insights • 🧠 Model: ${selectedModel.replace('_', ' ')}`
            : '📂 Upload data to unlock full AI capabilities'
          }
          <BookOpen className="w-3 h-3 ml-2" />
        </p>
      </div>
    </Card>
  );
};

export default AIChat;
