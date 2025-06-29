import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatasets } from '@/hooks/useDatasets';
import { fileUploadSchema, type FileUploadData } from '@/lib/validation';
import LoadingSpinner from '@/components/LoadingSpinner';
import EnhancedLoadingSpinner from '@/components/EnhancedLoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { SuccessAnimation, SparkleEffect } from '@/components/MicroInteractions';
import { useAchievements } from '@/hooks/useAchievements';
import DataJourneyVisualization, { DataJourneyStage } from '@/components/DataJourneyVisualization';
import type { UploadedFile, ColumnInfo } from '@/types';
import { toast } from 'sonner';
import confetti from '@/lib/confetti';

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentJourneyStage, setCurrentJourneyStage] = useState<DataJourneyStage>(null);
  const [journeyProgress, setJourneyProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { successToast, errorToast } = useToast();
  const { createDataset, insertDataRecords } = useDatasets();
  const { unlockAchievement } = useAchievements();

  // Enhanced loading messages
  const loadingMessages = [
    "Uploading your data...",
    "Validating file structure...",
    "Detecting column types...",
    "Analyzing data patterns...",
    "Preparing for AI analysis...",
    "Almost there..."
  ];

  const parseCSV = (text: string): Record<string, any>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      
      data.push(row);
    }

    return data;
  };

  const inferColumnType = (values: any[]): 'number' | 'text' | 'date' | 'boolean' => {
    const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
    if (nonEmptyValues.length === 0) return 'text';

    // Check if all values are numbers
    const numericValues = nonEmptyValues.filter(v => typeof v === 'number' || !isNaN(parseFloat(v)));
    if (numericValues.length === nonEmptyValues.length) return 'number';

    // Check if all values are booleans
    const booleanValues = nonEmptyValues.filter(v => 
      typeof v === 'boolean' || 
      (typeof v === 'string' && ['true', 'false', 'yes', 'no', '1', '0'].includes(v.toLowerCase()))
    );
    if (booleanValues.length === nonEmptyValues.length) return 'boolean';

    // Check if all values are dates
    const dateValues = nonEmptyValues.filter(v => {
      if (typeof v === 'string') {
        const date = new Date(v);
        return !isNaN(date.getTime());
      }
      return false;
    });
    if (dateValues.length === nonEmptyValues.length && dateValues.length > 0) return 'date';

    return 'text';
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setError(null);
    setCurrentJourneyStage('upload');
    setJourneyProgress(10);
    
    // Start the data journey visualization
    const simulateProgress = () => {
      setUploadProgress(prev => {
        if (prev < 90) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
      
      setJourneyProgress(prev => {
        if (prev < 90) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
    };
    
    const progressInterval = setInterval(simulateProgress, 200);
    
    for (const file of Array.from(files)) {
      try {
        // Validate file
        const fileData: FileUploadData = {
          name: file.name,
          size: file.size,
          type: (file.type || 'text/csv') as "text/csv" | "application/vnd.ms-excel",
        };

        fileUploadSchema.parse(fileData);

        if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
          setError('Please upload CSV files only');
          errorToast(
            "Invalid File Type",
            "Only CSV files are supported. Please upload a CSV file."
          );
          continue;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target?.result as string;
            const data = parseCSV(text);
            
            if (data.length === 0) {
              setError('The CSV file appears to be empty');
              errorToast(
                "Empty File",
                "The CSV file appears to be empty or has no valid data."
              );
              return;
            }

            // Update journey stage
            setCurrentJourneyStage('process');
            setJourneyProgress(30);

            // Extract column information with type inference
            const columnsInfo: ColumnInfo[] = Object.keys(data[0]).map(key => {
              const columnValues = data.map(row => row[key]);
              return {
                name: key,
                type: inferColumnType(columnValues),
                sample: data[0][key]
              };
            });

            // Simulate data processing
            setJourneyProgress(50);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update journey stage
            setCurrentJourneyStage('analyze');
            setJourneyProgress(70);
            
            // Simulate final processing
            setUploadProgress(95);
            await new Promise(resolve => setTimeout(resolve, 600));

            // Create dataset in database
            const dataset = await createDataset.mutateAsync({
              name: file.name.replace('.csv', ''),
              description: `Uploaded CSV file with ${data.length} rows`,
              file_name: file.name,
              file_size: file.size,
              columns_info: columnsInfo,
              row_count: data.length,
            });

            // Insert data records
            await insertDataRecords.mutateAsync({
              dataset_id: dataset.id,
              records: data,
            });

            const uploadedFile: UploadedFile = {
              name: file.name,
              size: file.size,
              type: file.type,
              data: data
            };

            setUploadedFiles(prev => [...prev, uploadedFile]);
            onFileUpload(uploadedFile);
            setUploadProgress(100);
            
            // Update journey stage
            setCurrentJourneyStage('insights');
            setJourneyProgress(90);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Complete journey
            setCurrentJourneyStage('complete');
            setJourneyProgress(100);

            // Show success animation
            setShowSuccess(true);
            
            // Trigger confetti effect
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });

            // Show success toast
            toast.success(
              "File Uploaded Successfully",
              {
                description: `Processed ${data.length} rows from ${file.name}`,
                duration: 5000
              }
            );
            
            // Unlock achievement for first dataset
            try {
              await unlockAchievement.mutateAsync('first_dataset');
              
              // If they have 5 datasets, unlock that achievement too
              if (uploadedFiles.length >= 4) { // This will be the 5th file
                await unlockAchievement.mutateAsync('five_datasets');
              }
            } catch (error) {
              console.error('Error unlocking achievement:', error);
            }
          } catch (error) {
            console.error('Error processing file:', error);
            
            let errorMessage = 'Please check your CSV format';
            let errorTitle = "Processing Error";
            
            if (error instanceof Error) {
              if (error.message.includes('validation')) {
                errorMessage = 'Invalid file format or size. Please check the requirements.';
                errorTitle = "Validation Error";
              } else if (error.message.includes('parse')) {
                errorMessage = 'Unable to parse CSV file. Please check the format.';
                errorTitle = "Parse Error";
              } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
                errorTitle = "Connection Error";
              }
            }

            setError(errorMessage);
            errorToast(errorTitle, errorMessage);
            
            // Reset journey on error
            setCurrentJourneyStage(null);
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('File validation error:', error);
        
        let errorMessage = 'Invalid file. Please check the requirements.';
        let errorTitle = "Validation Error";
        
        if (error instanceof Error) {
          if (error.message.includes('size')) {
            errorMessage = 'File is too large. Maximum size is 50MB.';
            errorTitle = "File Too Large";
          } else if (error.message.includes('type')) {
            errorMessage = 'Only CSV files are allowed.';
            errorTitle = "Invalid File Type";
          }
        }

        setError(errorMessage);
        errorToast(errorTitle, errorMessage);
        
        // Reset journey on error
        setCurrentJourneyStage(null);
      }
    }
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setUploadProgress(0);
    }, 1000);
  }, [createDataset, insertDataRecords, onFileUpload, successToast, errorToast, unlockAchievement, uploadedFiles.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleBrowseClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Reset success state after animation completes
  const handleSuccessComplete = () => {
    setShowSuccess(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 glass-effect">
        <motion.h3 
          className="text-lg font-semibold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Data Upload
        </motion.h3>
        
        <motion.div
          className={`upload-zone ${isDragOver ? 'border-neon-blue/80 bg-neon-blue/10' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.01, borderColor: 'rgba(0, 212, 255, 0.5)' }}
          role="button"
          tabIndex={0}
          aria-label="Upload CSV file by dragging and dropping or clicking to browse"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleBrowseClick();
            }
          }}
        >
          <div className="text-center">
            {isProcessing ? (
              <div className="space-y-4">
                <EnhancedLoadingSpinner 
                  size="lg" 
                  messages={loadingMessages}
                  showProgress={true}
                  progress={uploadProgress}
                />
              </div>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Upload className="w-12 h-12 text-neon-blue mx-auto mb-4" aria-hidden="true" />
                </motion.div>
                <h4 className="text-lg font-medium mb-2">
                  Upload your data files
                </h4>
                <p className="text-muted-foreground mb-4">
                  Drag and drop CSV files here, or click to browse
                </p>
                
                <input
                  type="file"
                  accept=".csv"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                  disabled={isProcessing}
                  aria-hidden="true"
                />
                
                <Button 
                  onClick={handleBrowseClick} 
                  className="cyber-button" 
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                  Choose Files
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div 
            className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div 
              className="mt-6 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-medium text-sm">Uploaded Files:</h4>
              {uploadedFiles.map((file, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center justify-between p-3 glass-effect rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
                >
                  <div className="flex items-center space-x-3">
                    <File className="w-4 h-4 text-neon-green" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.data?.length || 0} rows
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="w-4 h-4 text-neon-green" aria-hidden="true" />
                    </motion.div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Success animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SuccessAnimation 
                show={showSuccess} 
                onComplete={handleSuccessComplete}
                size="lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      {/* Data Journey Visualization */}
      {currentJourneyStage && (
        <DataJourneyVisualization 
          activeStage={currentJourneyStage}
          progress={journeyProgress}
          isVisible={true}
          onComplete={() => setCurrentJourneyStage(null)}
        />
      )}
    </div>
  );
};

export default FileUpload;
