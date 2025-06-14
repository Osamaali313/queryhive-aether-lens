
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, User, Loader2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useDatasets } from '@/hooks/useDatasets';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI analytics assistant. I can help you analyze your data, find patterns, and generate insights. What would you like to know about your data?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const { analyzeData, isLoading } = useAI();
  const { datasets } = useDatasets();
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
        // In a real implementation, you'd fetch the actual data
        // For now, we'll pass basic dataset info
        contextData = [{
          dataset_name: latestDataset.name,
          columns: latestDataset.columns_info,
          row_count: latestDataset.row_count,
        }];
      }

      const result = await analyzeData.mutateAsync({
        query: currentInput,
        data: contextData,
        type: 'natural_language',
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please make sure you have uploaded some data and try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
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

  return (
    <Card className="glass-effect h-[600px] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold flex items-center">
          <Brain className="w-5 h-5 mr-2 text-neon-purple" />
          AI Analytics Assistant
        </h3>
        <p className="text-sm text-muted-foreground">
          Ask questions about your data and get AI-powered insights
        </p>
      </div>

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
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
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
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
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
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {datasets.length > 0 
            ? `Using data from ${datasets.length} dataset(s)`
            : 'Upload data to get started with AI analysis'
          }
        </p>
      </div>
    </Card>
  );
};

export default AIChat;
