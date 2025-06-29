import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Brain, ArrowRight, Send, MessageSquare, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAI } from '@/hooks/useAI';
import { useDatasets } from '@/hooks/useDatasets';
import { supabase } from '@/integrations/supabase/client';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChatMessage } from '@/types';

interface AIQueryStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const AIQueryStep: React.FC<AIQueryStepProps> = ({ onNext, onSkip }) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `# 👋 Let's try your first AI query!

Try asking me a question about your data. For example:
- "What are the trends in my sales data?"
- "Show me the top products by revenue"
- "Analyze customer purchasing patterns"

Or click one of the suggested queries below to get started.`,
      timestamp: new Date(),
    }
  ]);
  const [hasAskedQuery, setHasAskedQuery] = useState(false);
  
  const { analyzeData, isLoading } = useAI();
  const { datasets } = useDatasets();

  const suggestedQueries = [
    "What are the trends in my sales data?",
    "Show me the top products by revenue",
    "Analyze customer purchasing patterns",
    "Which region has the highest sales?"
  ];

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

    try {
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

      const result = await analyzeData.mutateAsync({
        query: currentInput,
        data: contextData,
        type: 'enhanced_analysis'
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setHasAskedQuery(true);
    } catch (error) {
      console.error('AI Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `## ⚠️ Processing Error

I encountered an error while processing your request. This might be because:

- You haven't uploaded any data yet
- The system is still processing your data
- There was a temporary connection issue

Please try again with a simpler query or proceed with the onboarding.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Badge className="bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border-neon-purple/30 text-neon-purple mb-4">
          Step 2 of 5
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Ask Your First Question
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the power of AI analytics with natural language queries
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="glass-effect border-white/10 h-[400px] flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30'
                        : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === 'ai' ? (
                        <Brain className="w-5 h-5 mt-1 text-neon-purple flex-shrink-0" />
                      ) : (
                        <MessageSquare className="w-5 h-5 mt-1 text-neon-blue flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        {message.type === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        ) : (
                          <MarkdownRenderer content={message.content} />
                        )}
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
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-foreground">
                        AI is analyzing your query...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your data..."
                className="flex-1 glass-effect border-white/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="cyber-button"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <Lightbulb className="w-4 h-4 text-neon-yellow mr-2" />
          <span className="text-sm text-neon-yellow">Try one of these queries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuery(query)}
              className="text-xs glass-effect border-white/20 hover:border-neon-blue/50"
            >
              {query}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-between"
      >
        <Button 
          variant="outline" 
          onClick={onSkip}
          className="border-white/20"
        >
          Skip for now
        </Button>
        
        <Button 
          onClick={onNext} 
          className={`cyber-button ${hasAskedQuery ? 'bg-gradient-to-r from-neon-purple to-neon-blue' : ''}`}
        >
          {hasAskedQuery ? 'Continue' : 'Continue'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AIQueryStep;