import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { useA11y } from './a11y/A11yProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackSystemProps {
  interactionId: string;
  context?: Record<string, any>;
  onFeedbackSubmitted?: () => void;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ 
  interactionId, 
  context = {},
  onFeedbackSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  
  const { submitFeedback, isProcessing } = useLearningSystem();
  const { announce } = useA11y();

  const handleQuickFeedback = async (type: 'positive' | 'negative') => {
    setFeedbackType(type);
    const quickRating = type === 'positive' ? 5 : 2;
    
    await submitFeedback.mutateAsync({
      interactionId,
      feedbackType: type,
      rating: quickRating,
      context
    });
    
    announce(`${type} feedback submitted`, 'polite');
    onFeedbackSubmitted?.();
  };

  const handleDetailedSubmit = async () => {
    if (rating === 0) return;
    
    await submitFeedback.mutateAsync({
      interactionId,
      feedbackType,
      rating,
      comment: comment || undefined,
      context
    });
    
    announce(`Detailed feedback submitted with rating ${rating}`, 'polite');
    setShowDetailedForm(false);
    setRating(0);
    setComment('');
    onFeedbackSubmitted?.();
  };

  if (showDetailedForm) {
    return (
      <Card className="p-4 glass-effect border-white/10" role="form" aria-label="Detailed feedback form">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium" htmlFor="rating-stars">How would you rate this response?</Label>
            <div className="flex items-center space-x-1 mt-2" id="rating-stars" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRating(star);
                    setFeedbackType(star >= 4 ? 'positive' : star <= 2 ? 'negative' : 'neutral');
                    announce(`Selected rating: ${star} stars`, 'polite');
                  }}
                  className="p-1"
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                  aria-pressed={star <= rating}
                >
                  <Star 
                    className={`w-5 h-5 ${
                      star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="feedback-comment" className="text-sm font-medium">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="mt-1 glass-effect border-white/20"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleDetailedSubmit}
              disabled={rating === 0 || isProcessing}
              className="cyber-button"
              size="sm"
              aria-label="Submit feedback"
            >
              Submit Feedback
            </Button>
            <Button
              onClick={() => {
                setShowDetailedForm(false);
                announce('Feedback form closed', 'polite');
              }}
              variant="outline"
              size="sm"
              className="glass-effect border-white/20"
              aria-label="Cancel feedback"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-2 mt-2" role="toolbar" aria-label="Quick feedback options">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={() => handleQuickFeedback('positive')}
            variant="ghost"
            size="sm"
            disabled={isProcessing}
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
            aria-label="Positive feedback"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Button
            onClick={() => handleQuickFeedback('negative')}
            variant="ghost"
            size="sm"
            disabled={isProcessing}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            aria-label="Negative feedback"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Button
            onClick={() => {
              setShowDetailedForm(true);
              announce('Detailed feedback form opened', 'polite');
            }}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"
            aria-label="Provide detailed feedback"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FeedbackSystem;