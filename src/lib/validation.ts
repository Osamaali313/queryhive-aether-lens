import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
});

// Dataset schemas
export const datasetSchema = z.object({
  name: z.string().min(1, 'Dataset name is required').max(100, 'Dataset name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  file_name: z.string().min(1, 'File name is required'),
  file_size: z.number().positive('File size must be positive').optional(),
  columns_info: z.array(z.object({
    name: z.string(),
    type: z.enum(['number', 'text', 'date', 'boolean']),
    sample: z.any().optional(),
  })).optional(),
  row_count: z.number().min(0, 'Row count cannot be negative').optional(),
});

// AI query schemas
export const aiQuerySchema = z.object({
  query: z.string().min(1, 'Query cannot be empty').max(1000, 'Query must be less than 1000 characters'),
  data: z.array(z.record(z.any())).optional(),
  type: z.enum(['natural_language', 'enhanced_analysis']).optional(),
  modelType: z.string().optional(),
});

// ML analysis schemas
export const mlAnalysisSchema = z.object({
  datasetId: z.string().uuid('Invalid dataset ID'),
  modelType: z.enum(['linear_regression', 'clustering', 'anomaly_detection', 'time_series']),
  parameters: z.record(z.any()).optional(),
});

// Knowledge base schemas
export const knowledgeEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters'),
  category: z.string().min(1, 'Category is required').max(50, 'Category must be less than 50 characters'),
  tags: z.array(z.string().max(30, 'Tag must be less than 30 characters')).max(10, 'Maximum 10 tags allowed').optional(),
  metadata: z.record(z.any()).optional(),
});

// Feedback schemas
export const feedbackSchema = z.object({
  interactionId: z.string().min(1, 'Interaction ID is required'),
  feedbackType: z.enum(['positive', 'negative', 'neutral']),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
  context: z.record(z.any()).optional(),
});

// File upload schemas
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().positive('File size must be positive').max(50 * 1024 * 1024, 'File size must be less than 50MB'),
  type: z.string().refine(
    (type) => type === 'text/csv' || type === 'application/vnd.ms-excel',
    'Only CSV files are allowed'
  ),
});

// Processing pipeline schemas
export const pipelineSchema = z.object({
  name: z.string().min(1, 'Pipeline name is required').max(100, 'Pipeline name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  config: z.record(z.any()),
});

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type DatasetFormData = z.infer<typeof datasetSchema>;
export type AIQueryData = z.infer<typeof aiQuerySchema>;
export type MLAnalysisData = z.infer<typeof mlAnalysisSchema>;
export type KnowledgeEntryData = z.infer<typeof knowledgeEntrySchema>;
export type FeedbackData = z.infer<typeof feedbackSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type PipelineData = z.infer<typeof pipelineSchema>;
