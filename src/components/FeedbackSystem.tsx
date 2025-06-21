
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useLearningSystem } from '@/hooks/useLearningSystem';

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

  const handleQuickFeedback = async (type: 'positive' | 'negative') => {
    setFeedbackType(type);
    const quickRating = type === 'positive' ? 5 : 2;
    
    await submitFeedback.mutateAsync({
      interactionId,
      feedbackType: type,
      rating: quickRating,
      context
    });
    
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
    
    setShowDetailedForm(false);
    setRating(0);
    setComment('');
    onFeedbackSubmitted?.();
  };

  if (showDetailedForm) {
    return (
      <Card className="p-4 glass-effect border-white/10">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">How would you rate this response?</Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1"
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
            >
              Submit Feedback
            </Button>
            <Button
              onClick={() => setShowDetailedForm(false)}
              variant="outline"
              size="sm"
              className="glass-effect border-white/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-2 mt-2">
      <Button
        onClick={() => handleQuickFeedback('positive')}
        variant="ghost"
        size="sm"
        disabled={isProcessing}
        className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => handleQuickFeedback('negative')}
        variant="ghost"
        size="sm"
        disabled={isProcessing}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => setShowDetailedForm(true)}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"
      >
        <MessageSquare className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FeedbackSystem;
