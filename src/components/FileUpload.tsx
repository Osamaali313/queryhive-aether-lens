
import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data?: any[];
}

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Try to parse as number if possible
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      
      data.push(row);
    }

    return data;
  };

  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload CSV files only",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseCSV(text);
          
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
          console.error('Error parsing CSV:', error);
          toast({
            title: "Error processing file",
            description: "Please check your CSV format",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    });
  }, [onFileUpload, toast]);

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
          <Upload className="w-12 h-12 text-neon-blue mx-auto mb-4 animate-float" />
          <h4 className="text-lg font-medium mb-2">Upload your data files</h4>
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
          />
          
          <Button asChild className="cyber-button">
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
