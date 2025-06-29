import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, ArrowRight, Download, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import { useDatasets } from '@/hooks/useDatasets';
import { UploadedFile } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DataUploadStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const DataUploadStep: React.FC<DataUploadStepProps> = ({ onNext, onSkip }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { datasets } = useDatasets();
  const { toast } = useToast();

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    toast({
      title: "Data Uploaded Successfully",
      description: `${file.name} is ready for analysis`,
    });
  };

  const handleDownloadSample = () => {
    // Create sample CSV data
    const csvContent = `date,customer_id,product_name,category,quantity,unit_price,total_amount,sales_rep,region
2024-01-15,CUST001,Laptop Pro,Electronics,1,1299.99,1299.99,John Smith,North
2024-01-15,CUST002,Office Chair,Furniture,2,249.99,499.98,Sarah Johnson,South
2024-01-16,CUST003,Wireless Mouse,Electronics,3,29.99,89.97,Michael Brown,East
2024-01-16,CUST001,Monitor 24",Electronics,2,199.99,399.98,John Smith,North
2024-01-17,CUST004,Desk Lamp,Furniture,1,59.99,59.99,Sarah Johnson,South
2024-01-17,CUST005,Keyboard,Electronics,1,89.99,89.99,Michael Brown,East
2024-01-18,CUST002,Bookshelf,Furniture,1,179.99,179.99,John Smith,North
2024-01-18,CUST003,USB Drive,Electronics,5,19.99,99.95,Sarah Johnson,South
2024-01-19,CUST001,Headphones,Electronics,1,149.99,149.99,Michael Brown,East
2024-01-19,CUST004,Office Desk,Furniture,1,349.99,349.99,John Smith,North`;

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'sample_sales_data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const hasUploadedData = uploadedFile !== null || datasets.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Badge className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/30 text-neon-green mb-4">
          Step 1 of 5
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            Let's Add Your Data
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your first dataset to start discovering insights
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <FileUpload onFileUpload={handleFileUpload} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-neon-blue/10 flex-shrink-0">
                <Info className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Don't have data ready?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No problem! You can download our sample dataset to explore QueryHive AI's capabilities.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadSample}
                  className="border-neon-blue/30 text-neon-blue"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
          className={`cyber-button ${hasUploadedData ? 'bg-gradient-to-r from-neon-green to-neon-blue' : ''}`}
          disabled={!hasUploadedData}
        >
          {hasUploadedData && <Check className="w-4 h-4 mr-2" />}
          {hasUploadedData ? 'Continue' : 'Upload Data to Continue'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default DataUploadStep;