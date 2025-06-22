# QueryHive AI - Intelligent Data Analytics Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-2.50.0-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.11-blue?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-5.4.1-purple?style=for-the-badge&logo=vite" alt="Vite" />
</div>

## 🚀 Overview

QueryHive AI is a next-generation data analytics platform that transforms complex data into actionable insights using artificial intelligence. Built with modern web technologies, it provides natural language querying, machine learning models, and intelligent data processing capabilities.

### 🎯 Key Features

- **🧠 AI-Powered Analytics**: Natural language queries with intelligent responses
- **📊 Machine Learning Models**: Built-in regression, clustering, anomaly detection, and time series analysis
- **🔍 Knowledge Graph**: Advanced relationship mapping and discovery
- **📈 Real-time Dashboards**: Interactive visualizations and live data updates
- **🤖 Self-Learning System**: RLHF (Reinforcement Learning from Human Feedback) integration
- **📚 Knowledge Base**: Automated insight storage and retrieval
- **🔄 Data Processing Pipelines**: Automated data cleaning and transformation
- **👥 Team Collaboration**: Share insights and collaborate on analysis

## 🏗️ Architecture

### Frontend Stack
- **React 18.3.1** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system for modern UI
- **shadcn/ui** components for consistent design
- **TanStack Query** for efficient data fetching and caching
- **React Router** for client-side routing

### Backend Infrastructure
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with Row Level Security (RLS) for data protection
- **Edge Functions** for serverless AI processing
- **OpenRouter API** integration for AI model access

### AI & ML Capabilities
- **Natural Language Processing** for query understanding
- **Machine Learning Models**: Linear regression, K-means clustering, anomaly detection, time series analysis
- **Knowledge Graph** construction and relationship discovery
- **Personalized Learning System** with user feedback integration

## 📁 Project Structure

```
queryhive-ai/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AIChat.tsx       # AI assistant interface
│   │   ├── Dashboard.tsx    # Main analytics dashboard
│   │   ├── FileUpload.tsx   # Data upload component
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── hooks/               # Custom React hooks
│   │   ├── useAI.ts         # AI analytics integration
│   │   ├── useDatasets.ts   # Dataset management
│   │   ├── useMLModels.ts   # Machine learning operations
│   │   └── ...
│   ├── pages/               # Application pages
│   │   ├── Landing.tsx      # Marketing landing page
│   │   ├── Auth.tsx         # Authentication page
│   │   └── Index.tsx        # Main application
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   └── lib/                 # Utility functions
├── supabase/
│   ├── functions/           # Edge functions for AI processing
│   │   ├── ai-analytics/    # Main AI query processing
│   │   ├── ml-models/       # Machine learning operations
│   │   ├── knowledge-graph/ # Graph construction
│   │   └── ...
│   └── migrations/          # Database schema migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenRouter API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd queryhive-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Database Setup**
   
   Run Supabase migrations:
   ```bash
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the provided migrations to set up the database schema
3. Configure authentication providers as needed
4. Deploy edge functions for AI processing

### AI Integration

The platform integrates with OpenRouter for AI capabilities:
- Natural language query processing
- Intelligent data analysis
- Automated insight generation

## 📊 Features Deep Dive

### 1. Data Upload & Management
- **CSV Import**: Drag-and-drop CSV file upload
- **Data Validation**: Automatic data quality checks
- **Schema Detection**: Intelligent column type inference
- **Data Preview**: Real-time data exploration

### 2. AI-Powered Analytics
- **Natural Language Queries**: Ask questions in plain English
- **Contextual Understanding**: AI remembers conversation history
- **Multi-Model Support**: Choose from different AI models
- **Intelligent Responses**: Formatted insights with visualizations

### 3. Machine Learning Models
- **Linear Regression**: Relationship analysis and predictions
- **K-Means Clustering**: Data segmentation and grouping
- **Anomaly Detection**: Outlier identification
- **Time Series Analysis**: Trend analysis and forecasting

### 4. Knowledge Management
- **Knowledge Base**: Automatic insight storage
- **Knowledge Graph**: Relationship mapping between data entities
- **Semantic Search**: Find relevant insights quickly
- **Learning Patterns**: System learns from user interactions

### 5. Dashboard & Visualizations
- **Interactive Charts**: Real-time data visualizations
- **Custom Dashboards**: Personalized analytics views
- **Export Capabilities**: Share insights and reports
- **Responsive Design**: Works on all device sizes

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Secure user management with Supabase Auth
- **Data Isolation**: User data is completely isolated
- **API Security**: Secure edge function implementations
- **Privacy First**: No data sharing between users

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Recommended for frontend deployment
- **Netlify**: Alternative frontend hosting
- **Supabase**: Backend and database hosting

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use the established component patterns
- Maintain consistent code formatting
- Write meaningful commit messages

## 📈 Roadmap

### Q1 2025
- [ ] Advanced visualization types
- [ ] Real-time collaboration features
- [ ] Enhanced ML model library
- [ ] API integrations

### Q2 2025
- [ ] Mobile application
- [ ] Advanced knowledge graph features
- [ ] Enterprise SSO integration
- [ ] Advanced data connectors

### Q3 2025
- [ ] Custom ML model training
- [ ] Advanced analytics workflows
- [ ] Team management features
- [ ] Advanced export options

## 🐛 Known Issues & Improvements Needed

### High Priority
1. **Error Handling**: Improve error boundaries and user feedback
2. **Performance**: Optimize large dataset handling
3. **Testing**: Add comprehensive test coverage
4. **Documentation**: Expand API documentation

### Medium Priority
1. **Accessibility**: Improve WCAG compliance
2. **Internationalization**: Add multi-language support
3. **Offline Support**: Add PWA capabilities
4. **Mobile Optimization**: Enhance mobile experience

### Low Priority
1. **Theme Customization**: User-customizable themes
2. **Advanced Filters**: More sophisticated data filtering
3. **Batch Operations**: Bulk data operations
4. **Advanced Permissions**: Granular access control

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Component Guide](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@queryhive.ai

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **OpenRouter** for AI model access
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for the design system
- **React** and **TypeScript** communities

---

<div align="center">
  <p>Built with ❤️ by the QueryHive AI team</p>
  <p>
    <a href="https://queryhive.ai">Website</a> •
    <a href="https://docs.queryhive.ai">Documentation</a> •
    <a href="https://twitter.com/queryhiveai">Twitter</a>
  </p>
</div>