# QueryHive AI - Component Documentation

## Component Architecture

QueryHive AI follows a modular component architecture with clear separation of concerns. Components are organized into logical groups and follow consistent patterns.

## Core Components

### 1. AIChat Component

**Location:** `src/components/AIChat.tsx`

**Purpose:** Main AI assistant interface for natural language queries and ML model execution.

**Props:**
```typescript
interface AIChatProps {
  // No props - uses internal state and hooks
}
```

**Features:**
- Natural language query processing
- ML model selection and execution
- Conversation history
- Quick action buttons
- Feedback system integration
- Real-time response streaming

**Usage:**
```typescript
import AIChat from '@/components/AIChat';

function App() {
  return <AIChat />;
}
```

**Key Hooks Used:**
- `useAI()` - AI analytics integration
- `useMLModels()` - Machine learning operations
- `useLearningSystem()` - User feedback and learning
- `useKnowledgeBase()` - Knowledge management

### 2. Dashboard Component

**Location:** `src/components/Dashboard.tsx`

**Purpose:** Main analytics dashboard with metrics, charts, and insights overview.

**Features:**
- Real-time metrics display
- Interactive charts and visualizations
- AI insights summary
- Knowledge graph viewer
- Learning system metrics
- Recent activity feed

**Data Sources:**
- Datasets count and statistics
- AI insights and confidence scores
- Learning patterns and user feedback
- Knowledge base entries

### 3. FileUpload Component

**Location:** `src/components/FileUpload.tsx`

**Purpose:** Drag-and-drop file upload interface with CSV processing.

**Props:**
```typescript
interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data?: any[];
}
```

**Features:**
- Drag-and-drop interface
- CSV parsing and validation
- File size and type checking
- Progress indicators
- Error handling
- Data preview

**Usage:**
```typescript
import FileUpload from '@/components/FileUpload';

function DataUploadPage() {
  const handleFileUpload = (file: UploadedFile) => {
    console.log('File uploaded:', file);
  };

  return <FileUpload onFileUpload={handleFileUpload} />;
}
```

### 4. DatasetManager Component

**Location:** `src/components/DatasetManager.tsx`

**Purpose:** Dataset management interface with CRUD operations.

**Features:**
- Dataset listing with metadata
- Bulk selection and deletion
- File information display
- Search and filtering
- Status indicators

**Hooks Used:**
- `useDatasets()` - Dataset CRUD operations
- `useToast()` - User notifications

### 5. Header Component

**Location:** `src/components/Header.tsx`

**Purpose:** Application header with navigation and user controls.

**Features:**
- Logo and branding
- User authentication status
- Navigation menu
- User profile dropdown
- Sign out functionality

### 6. MarkdownRenderer Component

**Location:** `src/components/MarkdownRenderer.tsx`

**Purpose:** Renders markdown content with syntax highlighting and custom styling.

**Props:**
```typescript
interface MarkdownRendererProps {
  content: string;
  className?: string;
}
```

**Features:**
- Syntax highlighting for code blocks
- Custom table styling
- Link handling
- Typography optimization
- Security (XSS protection)

### 7. FeedbackSystem Component

**Location:** `src/components/FeedbackSystem.tsx`

**Purpose:** User feedback collection for AI responses and learning system.

**Props:**
```typescript
interface FeedbackSystemProps {
  interactionId: string;
  context?: Record<string, any>;
  onFeedbackSubmitted?: () => void;
}
```

**Features:**
- Quick thumbs up/down feedback
- Detailed rating system (1-5 stars)
- Comment collection
- Context-aware feedback
- Learning system integration

## UI Components (shadcn/ui)

### Base Components

Located in `src/components/ui/`, these are customized shadcn/ui components:

- **Button** - Various button styles and sizes
- **Card** - Container component with consistent styling
- **Input** - Form input with validation states
- **Label** - Form labels with accessibility
- **Tabs** - Tab navigation component
- **Badge** - Status and category indicators
- **Dialog** - Modal dialogs and overlays
- **Toast** - Notification system
- **Tooltip** - Contextual help and information

### Form Components

- **Form** - Form wrapper with validation
- **Select** - Dropdown selection component
- **Checkbox** - Checkbox input with states
- **Textarea** - Multi-line text input
- **RadioGroup** - Radio button groups

### Data Display

- **Table** - Data table with sorting and filtering
- **Accordion** - Collapsible content sections
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders

## Custom Hooks

### 1. useAI Hook

**Location:** `src/hooks/useAI.ts`

**Purpose:** AI analytics integration and query processing.

```typescript
const useAI = () => {
  const analyzeData = useMutation({
    mutationFn: async ({ query, data, type, modelType }) => {
      // AI processing logic
    }
  });

  return {
    analyzeData,
    isLoading: analyzeData.isPending,
  };
};
```

### 2. useDatasets Hook

**Location:** `src/hooks/useDatasets.ts`

**Purpose:** Dataset management and CRUD operations.

```typescript
const useDatasets = () => {
  const datasets = useQuery({
    queryKey: ['datasets', user?.id],
    queryFn: async () => {
      // Fetch datasets
    }
  });

  const createDataset = useMutation({
    mutationFn: async (datasetData) => {
      // Create dataset
    }
  });

  return {
    datasets: datasets.data || [],
    isLoading: datasets.isLoading,
    createDataset,
    insertDataRecords,
  };
};
```

### 3. useMLModels Hook

**Location:** `src/hooks/useMLModels.ts`

**Purpose:** Machine learning model execution and insights management.

```typescript
const useMLModels = () => {
  const runMLAnalysis = useMutation({
    mutationFn: async ({ datasetId, modelType, parameters }) => {
      // ML analysis logic
    }
  });

  const insights = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      // Fetch insights
    }
  });

  return {
    runMLAnalysis,
    insights: insights.data || [],
    isRunningAnalysis: runMLAnalysis.isPending,
  };
};
```

### 4. useLearningSystem Hook

**Location:** `src/hooks/useLearningSystem.ts`

**Purpose:** AI learning system and user feedback management.

```typescript
const useLearningSystem = () => {
  const submitFeedback = useMutation({
    mutationFn: async ({ interactionId, feedbackType, rating, comment, context }) => {
      // Submit feedback
    }
  });

  const getPersonalizedRecommendations = useMutation({
    mutationFn: async ({ context }) => {
      // Get recommendations
    }
  });

  return {
    patterns: patterns.data || [],
    submitFeedback,
    getPersonalizedRecommendations,
    isProcessing: submitFeedback.isPending,
  };
};
```

### 5. useKnowledgeBase Hook

**Location:** `src/hooks/useKnowledgeBase.ts`

**Purpose:** Knowledge base management and search functionality.

```typescript
const useKnowledgeBase = () => {
  const addEntry = useMutation({
    mutationFn: async ({ title, content, category, tags }) => {
      // Add knowledge entry
    }
  });

  const searchKnowledge = useMutation({
    mutationFn: async ({ query }) => {
      // Search knowledge base
    }
  });

  return {
    entries: entries.data || [],
    addEntry,
    searchKnowledge,
    isSearching: searchKnowledge.isPending,
  };
};
```

## Component Patterns

### 1. Error Handling Pattern

```typescript
const Component = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <div>{/* Component content */}</div>;
};
```

### 2. Form Handling Pattern

```typescript
const FormComponent = () => {
  const [formData, setFormData] = useState(initialState);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: submitData,
    onSuccess: () => {
      toast({ title: "Success", description: "Data saved successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### 3. Data Fetching Pattern

```typescript
const DataComponent = () => {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['data', user?.id],
    queryFn: () => fetchUserData(user.id),
    enabled: !!user?.id,
  });

  return (
    <div>
      {isLoading && <Skeleton />}
      {error && <ErrorMessage error={error} />}
      {data && <DataDisplay data={data} />}
    </div>
  );
};
```

## Styling Guidelines

### 1. Tailwind CSS Classes

Use consistent Tailwind classes for common patterns:

```typescript
// Glass effect
className="glass-effect" // bg-white/5 backdrop-blur-md border border-white/10

// Cyber button
className="cyber-button" // Custom gradient button style

// Neon colors
className="text-neon-blue" // #00d4ff
className="text-neon-purple" // #8b5cf6
className="text-neon-green" // #10b981
```

### 2. Component Variants

Use class-variance-authority for component variants:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Accessibility Guidelines

### 1. ARIA Labels

```typescript
<button
  aria-label="Upload CSV file"
  aria-describedby="upload-help"
  onClick={handleUpload}
>
  Upload Data
</button>
```

### 2. Keyboard Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleAction();
  }
};
```

### 3. Focus Management

```typescript
const dialogRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

## Performance Optimization

### 1. Memoization

```typescript
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data);
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return <div>{/* Component content */}</div>;
});
```

### 2. Code Splitting

```typescript
const LazyComponent = lazy(() => import('./ExpensiveComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Virtual Scrolling

For large datasets, implement virtual scrolling:

```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        {data[index].name}
      </div>
    )}
  </List>
);
```

## Testing Guidelines

### 1. Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Component from './Component';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />, { wrapper: createWrapper() });
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const onAction = jest.fn();
    render(<Component onAction={onAction} />, { wrapper: createWrapper() });
    
    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

### 2. Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('returns expected data', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

This component documentation provides a comprehensive guide for understanding and working with the QueryHive AI component architecture.