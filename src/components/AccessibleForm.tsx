import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AccessibleFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  className?: string;
}

const AccessibleForm: React.FC<AccessibleFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  className 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const watchedCategory = watch('category');

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const getFieldStatus = (fieldName: keyof FormData) => {
    const isTouched = touchedFields[fieldName];
    const hasError = errors[fieldName];
    
    if (!isTouched) return 'default';
    if (hasError) return 'error';
    return 'success';
  };

  const getAriaDescribedBy = (fieldName: keyof FormData) => {
    const status = getFieldStatus(fieldName);
    const ids = [];
    
    if (status === 'error') {
      ids.push(`${fieldName}-error`);
    }
    
    ids.push(`${fieldName}-help`);
    
    return ids.join(' ');
  };

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Contact Form</span>
          <span className="sr-only">(All fields marked with asterisk are required)</span>
        </CardTitle>
        <CardDescription>
          Please fill out this form to get in touch with us. We'll respond within 24 hours.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
          {/* Name Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="name" 
              className={cn(
                "text-sm font-medium",
                getFieldStatus('name') === 'error' && "text-red-400"
              )}
            >
              Full Name *
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={cn(
                  "transition-colors",
                  getFieldStatus('name') === 'error' && "border-red-500 focus:border-red-500",
                  getFieldStatus('name') === 'success' && "border-green-500"
                )}
                aria-describedby={getAriaDescribedBy('name')}
                aria-invalid={!!errors.name}
                aria-required="true"
                {...register('name')}
                disabled={isLoading}
              />
              {getFieldStatus('name') === 'success' && (
                <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-green-500" aria-hidden="true" />
              )}
              {getFieldStatus('name') === 'error' && (
                <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" aria-hidden="true" />
              )}
            </div>
            
            {errors.name && (
              <div id="name-error" role="alert" className="flex items-center space-x-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.name.message}</span>
              </div>
            )}
            
            <div id="name-help" className="text-xs text-muted-foreground">
              Enter your first and last name
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email"
              className={cn(
                "text-sm font-medium",
                getFieldStatus('email') === 'error' && "text-red-400"
              )}
            >
              Email Address *
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className={cn(
                  "transition-colors",
                  getFieldStatus('email') === 'error' && "border-red-500 focus:border-red-500",
                  getFieldStatus('email') === 'success' && "border-green-500"
                )}
                aria-describedby={getAriaDescribedBy('email')}
                aria-invalid={!!errors.email}
                aria-required="true"
                {...register('email')}
                disabled={isLoading}
              />
              {getFieldStatus('email') === 'success' && (
                <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-green-500" aria-hidden="true" />
              )}
              {getFieldStatus('email') === 'error' && (
                <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" aria-hidden="true" />
              )}
            </div>
            
            {errors.email && (
              <div id="email-error" role="alert" className="flex items-center space-x-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.email.message}</span>
              </div>
            )}
            
            <div id="email-help" className="text-xs text-muted-foreground">
              We'll use this to respond to your inquiry
            </div>
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="category"
              className={cn(
                "text-sm font-medium",
                getFieldStatus('category') === 'error' && "text-red-400"
              )}
            >
              Inquiry Category *
            </Label>
            <Select 
              value={watchedCategory} 
              onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
              disabled={isLoading}
            >
              <SelectTrigger 
                id="category"
                className={cn(
                  "transition-colors",
                  getFieldStatus('category') === 'error' && "border-red-500",
                  getFieldStatus('category') === 'success' && "border-green-500"
                )}
                aria-describedby={getAriaDescribedBy('category')}
                aria-invalid={!!errors.category}
                aria-required="true"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="sales">Sales Question</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
            
            {errors.category && (
              <div id="category-error" role="alert" className="flex items-center space-x-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.category.message}</span>
              </div>
            )}
            
            <div id="category-help" className="text-xs text-muted-foreground">
              Help us route your inquiry to the right team
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="message"
              className={cn(
                "text-sm font-medium",
                getFieldStatus('message') === 'error' && "text-red-400"
              )}
            >
              Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Please describe your inquiry in detail..."
              rows={4}
              className={cn(
                "transition-colors resize-none",
                getFieldStatus('message') === 'error' && "border-red-500 focus:border-red-500",
                getFieldStatus('message') === 'success' && "border-green-500"
              )}
              aria-describedby={getAriaDescribedBy('message')}
              aria-invalid={!!errors.message}
              aria-required="true"
              {...register('message')}
              disabled={isLoading}
            />
            
            {errors.message && (
              <div id="message-error" role="alert" className="flex items-center space-x-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.message.message}</span>
              </div>
            )}
            
            <div id="message-help" className="text-xs text-muted-foreground">
              Minimum 10 characters. Be as specific as possible.
            </div>
          </div>

          {/* Newsletter Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              {...register('newsletter')}
              disabled={isLoading}
              aria-describedby="newsletter-help"
            />
            <Label 
              htmlFor="newsletter" 
              className="text-sm font-medium cursor-pointer"
            >
              Subscribe to our newsletter for updates
            </Label>
          </div>
          <div id="newsletter-help" className="text-xs text-muted-foreground ml-6">
            Optional. You can unsubscribe at any time.
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full cyber-button"
            disabled={!isValid || isLoading}
            aria-describedby="submit-help"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
          
          <div id="submit-help" className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to our privacy policy
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccessibleForm;