import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatasets } from '@/hooks/useDatasets';
import { fileUploadSchema, type FileUploadData } from '@/lib/validation';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { UploadedFile, ColumnInfo } from '@/types';

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { createDataset, insertDataRecords } = useDatasets();

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
    
    for (const file of Array.from(files)) {
      try {
        // Validate file
        const fileData: FileUploadData = {
          name: file.name,
          size: file.size,
          type: file.type || 'text/csv', // Default to CSV if type is not detected
        };

        fileUploadSchema.parse(fileData);

        if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
          toast({
            title: "Invalid file type",
            description: "Please upload CSV files only",
            variant: "destructive",
          });
          continue;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target?.result as string;
            const data = parseCSV(text);
            
            if (data.length === 0) {
              toast({
                title: "Empty file",
                description: "The CSV file appears to be empty",
                variant: "destructive",
              });
              return;
            }

            // Extract column information with type inference
            const columnsInfo: ColumnInfo[] = Object.keys(data[0]).map(key => {
              const columnValues = data.map(row => row[key]);
              return {
                name: key,
                type: inferColumnType(columnValues),
                sample: data[0][key]
              };
            });

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

            toast({
              title: "File uploaded successfully",
              description: `Processed ${data.length} rows from ${file.name}`,
            });
          } catch (error) {
            console.error('Error processing file:', error);
            
            let errorMessage = 'Please check your CSV format';
            if (error instanceof Error) {
              if (error.message.includes('validation')) {
                errorMessage = 'Invalid file format or size. Please check the requirements.';
              } else if (error.message.includes('parse')) {
                errorMessage = 'Unable to parse CSV file. Please check the format.';
              } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
              }
            }

            toast({
              title: "Error processing file",
              description: errorMessage,
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('File validation error:', error);
        
        let errorMessage = 'Invalid file. Please check the requirements.';
        if (error instanceof Error && error.message.includes('size')) {
          errorMessage = 'File is too large. Maximum size is 50MB.';
        } else if (error instanceof Error && error.message.includes('type')) {
          errorMessage = 'Only CSV files are allowed.';
        }

        toast({
          title: "File validation failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
    
    setIsProcessing(false);
  }, [createDataset, insertDataRecords, onFileUpload, toast]);

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

  return (
    <Card className="p-6 glass-effect">
      <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
        Data Upload
      </h3>
      
      <div
        className={`upload-zone ${isDragOver ? 'border-neon-blue/80 bg-neon-blue/10' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          {isProcessing ? (
            <LoadingSpinner size="lg" message="Processing files..." />
          ) : (
            <Upload className="w-12 h-12 text-neon-blue mx-auto mb-4 animate-float" />
          )}
          <h4 className="text-lg font-medium mb-2">
            {isProcessing ? 'Processing files...' : 'Upload your data files'}
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
            disabled={isProcessing}
          />
          
          <Button asChild className="cyber-button" disabled={isProcessing}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </label>
          </Button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 glass-effect rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="w-4 h-4 text-neon-green" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.data?.length || 0} rows
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-neon-green" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default FileUpload;