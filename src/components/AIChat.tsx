
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Send, User, Loader2, Lightbulb } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels, MLModelType } from '@/hooks/useMLModels';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  modelType?: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI analytics assistant powered by advanced machine learning models. I can help you:\n\n• Analyze data patterns and trends\n• Run ML models (Linear Regression, Clustering, Anomaly Detection, Time Series)\n• Generate insights and recommendations\n• Create visualizations\n• Process and clean your data\n\nWhat would you like to explore today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<MLModelType>('linear_regression');
  const { analyzeData, isLoading } = useAI();
  const { datasets } = useDatasets();
  const { runMLAnalysis, insights } = useMLModels();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Get the latest dataset for context
      const latestDataset = datasets[0];
      let contextData = [];
      
      if (latestDataset) {
        // Get actual data records for better analysis
        const { data: records } = await window.supabase
          .from('data_records')
          .select('data')
          .eq('dataset_id', latestDataset.id)
          .limit(100);
        
        if (records && records.length > 0) {
          contextData = records.map(r => r.data);
        } else {
          // Fallback to dataset metadata
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
        type: 'natural_language',
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
    } catch (error) {
      console.error('AI Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. This could be due to:\n\n• API configuration issues\n• No data uploaded yet\n• Network connectivity\n\nPlease ensure you have uploaded some data and try again.',
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
    { id: 'data_quality', label: 'Check Quality', icon: '✅' }
  ];

  return (
    <Card className="glass-effect h-[600px] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold flex items-center">
          <Brain className="w-5 h-5 mr-2 text-neon-purple" />
          AI Analytics Assistant
        </h3>
        <p className="text-sm text-muted-foreground">
          Powered by advanced ML models • {insights.length} insights generated
        </p>
        
        {/* Model Selection */}
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
        </div>
      </div>

      {/* Quick Actions */}
      {datasets.length > 0 && (
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-1 mb-2">
            <Lightbulb className="w-3 h-3 text-neon-yellow" />
            <span className="text-xs text-muted-foreground">Quick Actions:</span>
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
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30'
                    : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-white/10'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' ? (
                    <Brain className="w-4 h-4 mt-1 text-neon-purple flex-shrink-0" />
                  ) : (
                    <User className="w-4 h-4 mt-1 text-neon-blue flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.modelType && (
                        <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                          {message.modelType.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-white/10">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-neon-purple" />
                  <Loader2 className="w-4 h-4 animate-spin text-neon-purple" />
                  <span className="text-sm text-muted-foreground">AI is analyzing with {selectedModel.replace('_', ' ')}...</span>
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
        <p className="text-xs text-muted-foreground mt-2">
          {datasets.length > 0 
            ? `Connected to ${datasets.length} dataset(s) • ${insights.length} insights generated • Model: ${selectedModel.replace('_', ' ')}`
            : 'Upload data to unlock full AI capabilities'
          }
        </p>
      </div>
    </Card>
  );
};

export default AIChat;
