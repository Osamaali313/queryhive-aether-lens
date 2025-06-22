# API Overview

Comprehensive guide to the QueryHive AI REST API, enabling you to integrate advanced analytics capabilities into your applications and systems.

## Introduction to the API

The QueryHive AI API provides programmatic access to all platform capabilities, allowing you to:

- **Automate Data Operations**: Upload, process, and manage datasets
- **Execute AI Analytics**: Run natural language queries and ML models
- **Access Insights**: Retrieve analysis results and visualizations
- **Manage Resources**: Control workspaces, users, and permissions
- **Build Custom Applications**: Embed analytics in your software

### API Architecture

**RESTful Design**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request and response format
- Predictable resource-oriented URLs
- Comprehensive status codes
- Consistent error handling

**API Versioning**
- Current version: v1 (stable)
- Version specified in URL path
- Backward compatibility commitment
- Deprecation notices with timeline
- Migration guides for version updates

**Base URL**
```
https://api.queryhive.ai/v1
```

## Authentication and Security

### Authentication Methods

**API Key Authentication**
```
curl -X GET "https://api.queryhive.ai/v1/datasets" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**OAuth 2.0 Authentication**
```
# Step 1: Obtain authorization code
https://auth.queryhive.ai/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  scope=read:datasets write:analyses

# Step 2: Exchange code for access token
curl -X POST "https://auth.queryhive.ai/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&
      code=AUTHORIZATION_CODE&
      client_id=YOUR_CLIENT_ID&
      client_secret=YOUR_CLIENT_SECRET&
      redirect_uri=YOUR_REDIRECT_URI"

# Step 3: Use access token
curl -X GET "https://api.queryhive.ai/v1/datasets" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### Security Best Practices

**API Key Management**
```
Key Security Guidelines:
• Store API keys securely (environment variables, secrets manager)
• Never hardcode keys in source code
• Rotate keys regularly (90-day recommendation)
• Use different keys for development and production
• Implement least-privilege access

Example Key Storage (Node.js):
// Load API key from environment variable
const apiKey = process.env.QUERYHIVE_API_KEY;
if (!apiKey) {
  throw new Error('Missing API key');
}
```

**Request Signing**
```
HMAC Request Signing:
1. Create string to sign (HTTP method + path + timestamp + request body)
2. Generate HMAC signature using secret key
3. Include signature in X-Signature header
4. Include timestamp in X-Timestamp header

Example (Python):
import hmac, hashlib, time

def sign_request(method, path, body, secret):
    timestamp = str(int(time.time()))
    message = method + path + timestamp + (body or '')
    signature = hmac.new(
        secret.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature, timestamp
```

**Transport Security**
```
Security Requirements:
• TLS 1.2+ for all API communications
• Certificate validation enabled
• Strong cipher suites
• HTTP Strict Transport Security (HSTS)
• Regular security scanning

Implementation Check:
curl -v https://api.queryhive.ai/v1/health
# Verify TLS version and certificate details
```

## Core API Resources

### Datasets API

**List Datasets**
```
GET /datasets

Query Parameters:
• page: Page number for pagination
• limit: Results per page (default: 20, max: 100)
• sort: Sort field (created_at, name, size)
• order: Sort order (asc, desc)
• filter: Filter criteria (JSON)

Response:
{
  "data": [
    {
      "id": "ds_12345",
      "name": "Sales Data 2024",
      "description": "Monthly sales transactions",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:22:00Z",
      "row_count": 10247,
      "column_count": 15,
      "file_size_bytes": 2457600,
      "quality_score": 0.94
    },
    // Additional datasets...
  ],
  "meta": {
    "total_count": 47,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

**Get Dataset Details**
```
GET /datasets/{dataset_id}

Response:
{
  "id": "ds_12345",
  "name": "Sales Data 2024",
  "description": "Monthly sales transactions",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:22:00Z",
  "row_count": 10247,
  "column_count": 15,
  "file_size_bytes": 2457600,
  "quality_score": 0.94,
  "columns": [
    {
      "name": "transaction_id",
      "type": "string",
      "description": "Unique transaction identifier",
      "missing_count": 0,
      "unique_count": 10247,
      "sample_values": ["TX-1001", "TX-1002", "TX-1003"]
    },
    {
      "name": "date",
      "type": "datetime",
      "description": "Transaction date",
      "missing_count": 0,
      "min_value": "2023-01-01T00:00:00Z",
      "max_value": "2023-12-31T23:59:59Z",
      "sample_values": ["2023-01-15", "2023-02-28", "2023-03-17"]
    },
    {
      "name": "amount",
      "type": "numeric",
      "description": "Transaction amount",
      "missing_count": 12,
      "min_value": 10.50,
      "max_value": 15000.00,
      "mean_value": 347.82,
      "median_value": 124.50,
      "sample_values": [124.50, 347.82, 1500.00]
    }
    // Additional columns...
  ],
  "tags": ["sales", "transactions", "2024", "monthly"],
  "owner": {
    "id": "user_5678",
    "name": "John Smith",
    "email": "john@example.com"
  },
  "permissions": {
    "can_view": true,
    "can_edit": true,
    "can_delete": true,
    "can_share": true
  }
}
```

**Create Dataset**
```
POST /datasets

Request Body:
{
  "name": "Customer Segmentation Data",
  "description": "Customer data for segmentation analysis",
  "tags": ["customers", "segmentation", "analysis"],
  "source": {
    "type": "file_upload",
    "format": "csv",
    "options": {
      "delimiter": ",",
      "has_header": true,
      "encoding": "utf-8"
    }
  }
}

Response:
{
  "id": "ds_67890",
  "name": "Customer Segmentation Data",
  "description": "Customer data for segmentation analysis",
  "created_at": "2024-01-20T09:15:00Z",
  "status": "pending",
  "upload_url": "https://upload.queryhive.ai/presigned/abc123xyz",
  "upload_fields": {
    "key": "datasets/ds_67890/data.csv",
    "policy": "eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0yMVQwOToxNTowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJxdWVyeWhpdmUtdXBsb2FkcyJ9LHsia2V5IjoiZGF0YXNldHMvZHNfNjc4OTAvZGF0YS5jc3YifSx7ImFjbCI6InByaXZhdGUifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9XX0=",
    "x-amz-signature": "abc123xyz"
  }
}
```

**Upload Dataset Data**
```
# Using the presigned URL from dataset creation
curl -X POST "https://upload.queryhive.ai/presigned/abc123xyz" \
  -F "key=datasets/ds_67890/data.csv" \
  -F "policy=eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0yMVQwOToxNTowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJxdWVyeWhpdmUtdXBsb2FkcyJ9LHsia2V5IjoiZGF0YXNldHMvZHNfNjc4OTAvZGF0YS5jc3YifSx7ImFjbCI6InByaXZhdGUifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9XX0=" \
  -F "x-amz-signature=abc123xyz" \
  -F "file=@/path/to/customer_data.csv"

# Check upload status
GET /datasets/ds_67890/status

Response:
{
  "id": "ds_67890",
  "status": "processing",
  "progress": 0.75,
  "message": "Validating data types",
  "estimated_completion": "2024-01-20T09:17:30Z"
}
```

**Update Dataset**
```
PATCH /datasets/{dataset_id}

Request Body:
{
  "name": "Customer Segmentation Data 2024",
  "description": "Updated customer data for segmentation analysis",
  "tags": ["customers", "segmentation", "analysis", "2024"]
}

Response:
{
  "id": "ds_67890",
  "name": "Customer Segmentation Data 2024",
  "description": "Updated customer data for segmentation analysis",
  "updated_at": "2024-01-20T10:45:00Z",
  "tags": ["customers", "segmentation", "analysis", "2024"]
}
```

**Delete Dataset**
```
DELETE /datasets/{dataset_id}

Response:
{
  "success": true,
  "message": "Dataset deleted successfully"
}
```

### AI Analytics API

**Natural Language Query**
```
POST /ai/query

Request Body:
{
  "dataset_id": "ds_12345",
  "query": "What are the sales trends by region over the last 6 months?",
  "response_format": "detailed",
  "include_visualizations": true
}

Response:
{
  "query_id": "q_98765",
  "status": "completed",
  "processing_time_ms": 1247,
  "response": {
    "text": "Sales have shown a positive trend across all regions over the last 6 months, with the North region showing the strongest growth at 23.4%. The East region follows with 18.7% growth, while the West and South regions show more moderate growth at 12.3% and 9.8% respectively.",
    "confidence": 0.94,
    "data": {
      "summary": {
        "overall_trend": "positive",
        "growth_rate": 0.16,
        "top_region": "North",
        "bottom_region": "South"
      },
      "regional_trends": [
        {
          "region": "North",
          "growth_rate": 0.234,
          "current_month": 1245000,
          "previous_month": 1180000
        },
        // Additional regions...
      ],
      "monthly_data": [
        {
          "month": "2023-07",
          "North": 980000,
          "East": 870000,
          "West": 750000,
          "South": 690000
        },
        // Additional months...
      ]
    },
    "visualizations": [
      {
        "type": "line_chart",
        "title": "Monthly Sales by Region",
        "data_keys": ["month", "North", "East", "West", "South"],
        "config": {
          "x_axis": "month",
          "y_axis": ["North", "East", "West", "South"],
          "colors": ["#4285F4", "#34A853", "#FBBC05", "#EA4335"]
        },
        "image_url": "https://api.queryhive.ai/visualizations/q_98765/chart1.png",
        "interactive_url": "https://api.queryhive.ai/visualizations/q_98765/chart1.html"
      },
      // Additional visualizations...
    ]
  }
}
```

**Run ML Model**
```
POST /ai/models/run

Request Body:
{
  "dataset_id": "ds_12345",
  "model_type": "linear_regression",
  "target_column": "sales_amount",
  "feature_columns": ["marketing_spend", "season", "region", "product_category"],
  "parameters": {
    "test_size": 0.2,
    "random_state": 42
  }
}

Response:
{
  "model_run_id": "mr_24680",
  "status": "completed",
  "processing_time_ms": 3456,
  "results": {
    "model_type": "linear_regression",
    "model_quality": {
      "r_squared": 0.87,
      "mean_absolute_error": 1245.67,
      "mean_squared_error": 4567.89,
      "root_mean_squared_error": 67.59
    },
    "coefficients": [
      {
        "feature": "marketing_spend",
        "coefficient": 2.34,
        "p_value": 0.001,
        "significance": "high"
      },
      {
        "feature": "season_summer",
        "coefficient": 12500,
        "p_value": 0.003,
        "significance": "high"
      },
      // Additional coefficients...
    ],
    "equation": "sales_amount = 45000 + 2.34*marketing_spend + 12500*season_summer + ...",
    "predictions": {
      "sample_size": 100,
      "sample_predictions": [
        {
          "actual": 124500,
          "predicted": 131245,
          "error": -6745
        },
        // Additional predictions...
      ]
    },
    "visualizations": [
      {
        "type": "scatter_plot",
        "title": "Actual vs Predicted Sales",
        "image_url": "https://api.queryhive.ai/visualizations/mr_24680/scatter.png"
      },
      // Additional visualizations...
    ]
  }
}
```

**Knowledge Graph Query**
```
POST /ai/knowledge-graph/query

Request Body:
{
  "dataset_id": "ds_12345",
  "query": "What products are frequently purchased together?",
  "min_relationship_strength": 0.3,
  "limit": 10
}

Response:
{
  "query_id": "kgq_13579",
  "status": "completed",
  "processing_time_ms": 2345,
  "results": {
    "nodes": [
      {
        "id": "n_1001",
        "type": "product",
        "name": "Laptop Pro",
        "properties": {
          "category": "Electronics",
          "price_tier": "Premium",
          "launch_date": "2023-06-15"
        }
      },
      // Additional nodes...
    ],
    "relationships": [
      {
        "source": "n_1001",
        "target": "n_1002",
        "type": "purchased_with",
        "strength": 0.78,
        "properties": {
          "co_occurrence_count": 1247,
          "confidence": 0.92
        }
      },
      // Additional relationships...
    ],
    "insights": [
      {
        "type": "product_bundle",
        "description": "Laptop Pro is frequently purchased with Laptop Bag (78%) and Wireless Mouse (65%)",
        "confidence": 0.92
      },
      // Additional insights...
    ],
    "visualization": {
      "type": "network_graph",
      "image_url": "https://api.queryhive.ai/visualizations/kgq_13579/graph.png",
      "interactive_url": "https://api.queryhive.ai/visualizations/kgq_13579/graph.html"
    }
  }
}
```

### Insights API

**List Insights**
```
GET /insights

Query Parameters:
• dataset_id: Filter by dataset
• type: Filter by insight type
• min_confidence: Minimum confidence score
• created_after: ISO timestamp
• limit: Results per page

Response:
{
  "data": [
    {
      "id": "ins_54321",
      "dataset_id": "ds_12345",
      "type": "trend_analysis",
      "title": "Sales Growth by Region",
      "description": "Analysis of regional sales trends over 6 months",
      "confidence_score": 0.94,
      "created_at": "2024-01-18T14:30:00Z",
      "created_by": {
        "id": "user_5678",
        "name": "John Smith"
      },
      "tags": ["sales", "regional", "trends"],
      "has_visualization": true
    },
    // Additional insights...
  ],
  "meta": {
    "total_count": 28,
    "page": 1,
    "limit": 20
  }
}
```

**Get Insight Details**
```
GET /insights/{insight_id}

Response:
{
  "id": "ins_54321",
  "dataset_id": "ds_12345",
  "type": "trend_analysis",
  "title": "Sales Growth by Region",
  "description": "Analysis of regional sales trends over 6 months",
  "content": {
    "summary": "Sales have shown a positive trend across all regions over the last 6 months, with the North region showing the strongest growth at 23.4%.",
    "details": "The North region's exceptional performance is driven by new store openings and increased marketing spend. The East region follows with 18.7% growth, primarily from existing store performance improvements. The West and South regions show more moderate growth at 12.3% and 9.8% respectively, in line with market averages.",
    "methodology": "This analysis uses linear regression to calculate growth rates based on monthly sales data from January to June 2024. Seasonal adjustments have been applied to account for typical Q1-Q2 patterns.",
    "limitations": "This analysis does not account for the impact of new product launches scheduled for Q3, which may alter regional performance patterns."
  },
  "data": {
    "regional_trends": [
      {
        "region": "North",
        "growth_rate": 0.234,
        "current_month": 1245000,
        "previous_month": 1180000
      },
      // Additional regions...
    ],
    "monthly_data": [
      {
        "month": "2024-01",
        "North": 980000,
        "East": 870000,
        "West": 750000,
        "South": 690000
      },
      // Additional months...
    ]
  },
  "visualizations": [
    {
      "id": "viz_11111",
      "type": "line_chart",
      "title": "Monthly Sales by Region",
      "description": "6-month sales trend across regions",
      "image_url": "https://api.queryhive.ai/visualizations/ins_54321/chart1.png",
      "interactive_url": "https://api.queryhive.ai/visualizations/ins_54321/chart1.html"
    },
    // Additional visualizations...
  ],
  "confidence_score": 0.94,
  "created_at": "2024-01-18T14:30:00Z",
  "updated_at": "2024-01-19T09:15:00Z",
  "created_by": {
    "id": "user_5678",
    "name": "John Smith",
    "email": "john@example.com"
  },
  "tags": ["sales", "regional", "trends"],
  "related_insights": [
    {
      "id": "ins_54322",
      "title": "Marketing Impact on Regional Sales",
      "similarity_score": 0.87
    },
    // Additional related insights...
  ]
}
```

**Create Insight**
```
POST /insights

Request Body:
{
  "dataset_id": "ds_12345",
  "type": "custom_analysis",
  "title": "Q1 Performance Review",
  "description": "Comprehensive analysis of Q1 2024 performance",
  "content": {
    "summary": "Q1 performance exceeded targets by 12% overall",
    "details": "Detailed analysis text...",
    "methodology": "Analysis methodology...",
    "limitations": "Known limitations..."
  },
  "data": {
    // Custom data structure
  },
  "tags": ["quarterly", "performance", "2024", "Q1"]
}

Response:
{
  "id": "ins_54323",
  "dataset_id": "ds_12345",
  "type": "custom_analysis",
  "title": "Q1 Performance Review",
  "created_at": "2024-01-20T11:45:00Z",
  "status": "active",
  // Additional fields...
}
```

### Dashboards API

**List Dashboards**
```
GET /dashboards

Response:
{
  "data": [
    {
      "id": "dash_98765",
      "name": "Executive Sales Dashboard",
      "description": "Key sales metrics for executive review",
      "created_at": "2024-01-10T08:30:00Z",
      "updated_at": "2024-01-19T16:45:00Z",
      "created_by": {
        "id": "user_5678",
        "name": "John Smith"
      },
      "is_public": false,
      "widget_count": 8,
      "thumbnail_url": "https://api.queryhive.ai/dashboards/dash_98765/thumbnail.png"
    },
    // Additional dashboards...
  ],
  "meta": {
    "total_count": 12,
    "page": 1,
    "limit": 20
  }
}
```

**Get Dashboard Details**
```
GET /dashboards/{dashboard_id}

Response:
{
  "id": "dash_98765",
  "name": "Executive Sales Dashboard",
  "description": "Key sales metrics for executive review",
  "layout": {
    "type": "grid",
    "columns": 12,
    "rows": 8
  },
  "widgets": [
    {
      "id": "widget_11111",
      "type": "kpi",
      "title": "Total Revenue",
      "position": {
        "x": 0,
        "y": 0,
        "width": 3,
        "height": 2
      },
      "data_source": {
        "type": "insight",
        "insight_id": "ins_54321",
        "data_path": "summary.total_revenue"
      },
      "display": {
        "format": "currency",
        "prefix": "$",
        "suffix": "",
        "decimal_places": 2,
        "color_scheme": "blue",
        "comparison": {
          "type": "previous_period",
          "label": "vs Last Month",
          "show_percentage": true
        }
      }
    },
    {
      "id": "widget_22222",
      "type": "chart",
      "title": "Monthly Sales by Region",
      "position": {
        "x": 3,
        "y": 0,
        "width": 9,
        "height": 4
      },
      "data_source": {
        "type": "insight",
        "insight_id": "ins_54321",
        "data_path": "monthly_data"
      },
      "display": {
        "chart_type": "line",
        "x_axis": "month",
        "y_axis": ["North", "East", "West", "South"],
        "colors": ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
        "legend_position": "bottom",
        "show_data_labels": false
      }
    },
    // Additional widgets...
  ],
  "filters": [
    {
      "id": "filter_11111",
      "type": "date_range",
      "name": "date_filter",
      "label": "Date Range",
      "default_value": {
        "start": "2024-01-01",
        "end": "2024-03-31"
      },
      "affects_widgets": ["widget_11111", "widget_22222"]
    },
    // Additional filters...
  ],
  "sharing": {
    "is_public": false,
    "public_url": null,
    "shared_with": [
      {
        "type": "user",
        "id": "user_1234",
        "name": "Jane Doe",
        "permission": "view"
      },
      {
        "type": "team",
        "id": "team_5678",
        "name": "Executive Team",
        "permission": "view"
      }
    ],
    "embed_code": null
  },
  "created_at": "2024-01-10T08:30:00Z",
  "updated_at": "2024-01-19T16:45:00Z",
  "created_by": {
    "id": "user_5678",
    "name": "John Smith",
    "email": "john@example.com"
  },
  "last_viewed_at": "2024-01-20T09:15:00Z",
  "view_count": 127
}
```

## Rate Limits and Quotas

### Rate Limiting

**Default Limits**
```
Rate Limit Structure:
• Authentication Endpoints: 10 requests per minute
• Dataset Operations: 60 requests per minute
• AI Analytics: 30 requests per minute
• Insights API: 60 requests per minute
• Dashboards API: 60 requests per minute

Response Headers:
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1579782000
```

**Handling Rate Limits**
```
HTTP 429 Response:
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please retry after 25 seconds.",
    "retry_after": 25
  }
}

Best Practices:
• Implement exponential backoff
• Cache responses when possible
• Batch requests to reduce API calls
• Monitor rate limit headers
• Schedule non-urgent operations
```

### Service Tiers

**Quota Allocation**
```
Free Tier:
• 1,000 API calls per month
• 5 datasets (max 10MB each)
• 10 insights
• 3 dashboards
• Standard rate limits

Professional Tier:
• 50,000 API calls per month
• 50 datasets (max 100MB each)
• Unlimited insights
• 20 dashboards
• Enhanced rate limits

Enterprise Tier:
• Unlimited API calls
• Unlimited datasets (max 1GB each)
• Unlimited insights and dashboards
• Custom rate limits
• Dedicated infrastructure
```

**Quota Management**
```
Monitoring Usage:
GET /account/usage

Response:
{
  "current_period": {
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-31T23:59:59Z",
    "days_remaining": 11
  },
  "quotas": {
    "api_calls": {
      "limit": 50000,
      "used": 12547,
      "remaining": 37453,
      "percent_used": 25.1
    },
    "datasets": {
      "limit": 50,
      "used": 12,
      "remaining": 38,
      "percent_used": 24.0
    },
    "storage_bytes": {
      "limit": 5368709120,
      "used": 1073741824,
      "remaining": 4294967296,
      "percent_used": 20.0
    }
  },
  "rate_limits": {
    "authentication": {
      "requests_per_minute": 10
    },
    "datasets": {
      "requests_per_minute": 60
    },
    "ai_analytics": {
      "requests_per_minute": 30
    }
  }
}
```

## Error Handling

### Error Format

**Standard Error Response**
```
HTTP 400 Bad Request:
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "date_range.start",
        "message": "Start date must be before end date"
      },
      {
        "field": "limit",
        "message": "Limit must be between 1 and 100"
      }
    ],
    "request_id": "req_abc123xyz"
  }
}
```

**Common Error Codes**
```
Authentication Errors:
• invalid_credentials: Invalid API key or token
• expired_token: Authentication token has expired
• insufficient_permissions: Lacking required permissions

Validation Errors:
• validation_error: Request parameters invalid
• invalid_format: Data format not supported
• missing_required: Required field missing

Resource Errors:
• not_found: Requested resource doesn't exist
• already_exists: Resource already exists
• resource_conflict: Resource state conflict

Service Errors:
• rate_limit_exceeded: Too many requests
• quota_exceeded: Usage quota exceeded
• service_unavailable: Service temporarily unavailable
• internal_error: Unexpected server error
```

### Error Handling Best Practices

**Client-Side Error Handling**
```javascript
// JavaScript example
async function fetchDataset(datasetId) {
  try {
    const response = await fetch(`https://api.queryhive.ai/v1/datasets/${datasetId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle specific error types
      switch (errorData.error.code) {
        case 'not_found':
          console.error(`Dataset ${datasetId} not found`);
          // Handle missing dataset
          break;
        case 'invalid_credentials':
          console.error('Authentication failed, refreshing credentials...');
          // Refresh authentication
          break;
        case 'rate_limit_exceeded':
          const retryAfter = errorData.error.retry_after || 30;
          console.error(`Rate limit exceeded, retrying in ${retryAfter} seconds`);
          // Implement retry with backoff
          setTimeout(() => fetchDataset(datasetId), retryAfter * 1000);
          break;
        default:
          console.error(`API error: ${errorData.error.message}`);
          // Generic error handling
      }
      
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Network or parsing error:', error);
    // Handle network failures
    return null;
  }
}
```

**Retry Strategies**
```javascript
// Exponential backoff implementation
async function fetchWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.status !== 429) {
        return response;
      }
      
      // Handle rate limiting
      const errorData = await response.json();
      const retryAfter = errorData.error.retry_after || 1;
      const backoffTime = retryAfter * Math.pow(2, retries);
      
      console.log(`Rate limited. Retrying in ${backoffTime} seconds...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
      
      retries++;
    } catch (error) {
      if (retries === maxRetries - 1) {
        throw error;
      }
      
      const backoffTime = Math.pow(2, retries);
      console.log(`Network error. Retrying in ${backoffTime} seconds...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
      
      retries++;
    }
  }
  
  throw new Error(`Failed after ${maxRetries} retries`);
}
```

## Webhooks

### Webhook Configuration

**Available Events**
```
Dataset Events:
• dataset.created: New dataset created
• dataset.updated: Dataset information updated
• dataset.deleted: Dataset deleted
• dataset.processing.completed: Data processing finished
• dataset.processing.failed: Data processing failed

Analysis Events:
• analysis.started: Analysis job started
• analysis.completed: Analysis job completed
• analysis.failed: Analysis job failed

Insight Events:
• insight.created: New insight generated
• insight.updated: Insight information updated
• insight.deleted: Insight deleted

Dashboard Events:
• dashboard.created: New dashboard created
• dashboard.updated: Dashboard updated
• dashboard.shared: Dashboard shared with users
• dashboard.viewed: Dashboard viewed by user
```

**Webhook Registration**
```
POST /webhooks

Request Body:
{
  "url": "https://example.com/webhooks/queryhive",
  "events": ["dataset.created", "analysis.completed", "insight.created"],
  "description": "Production webhook for data pipeline integration",
  "secret": "whsec_abcdefghijklmnopqrstuvwxyz123456",
  "active": true
}

Response:
{
  "id": "wh_12345",
  "url": "https://example.com/webhooks/queryhive",
  "events": ["dataset.created", "analysis.completed", "insight.created"],
  "description": "Production webhook for data pipeline integration",
  "active": true,
  "created_at": "2024-01-20T14:30:00Z"
}
```

### Webhook Payloads

**Event Payload Structure**
```json
{
  "event": "dataset.created",
  "created_at": "2024-01-20T15:30:00Z",
  "webhook_id": "wh_12345",
  "data": {
    "id": "ds_67890",
    "name": "Customer Segmentation Data",
    "description": "Customer data for segmentation analysis",
    "created_at": "2024-01-20T15:30:00Z",
    "created_by": {
      "id": "user_5678",
      "name": "John Smith"
    },
    "status": "processing"
  }
}
```

**Webhook Security**
```
Signature Verification:
1. Webhook includes X-QueryHive-Signature header
2. Signature is HMAC-SHA256 of payload using webhook secret
3. Verify signature before processing webhook

Example Verification (Node.js):
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express middleware example
app.post('/webhooks/queryhive', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-queryhive-signature'];
  const payload = req.body;
  
  if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(payload);
  // Process webhook event
  
  res.status(200).send('Webhook received');
});
```

## SDK Libraries

### Official SDKs

**JavaScript/TypeScript SDK**
```javascript
// Installation
// npm install queryhive-sdk

// Usage
import { QueryHive } from 'queryhive-sdk';

const queryhive = new QueryHive({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.queryhive.ai/v1'
});

// List datasets
async function listDatasets() {
  try {
    const { data, meta } = await queryhive.datasets.list({
      limit: 10,
      sort: 'created_at',
      order: 'desc'
    });
    
    console.log(`Found ${meta.total_count} datasets`);
    data.forEach(dataset => {
      console.log(`${dataset.name}: ${dataset.row_count} rows`);
    });
  } catch (error) {
    console.error('Error listing datasets:', error);
  }
}

// Run AI query
async function analyzeData(datasetId, query) {
  try {
    const result = await queryhive.ai.query({
      dataset_id: datasetId,
      query: query,
      include_visualizations: true
    });
    
    console.log('Analysis result:', result.response.text);
    console.log('Confidence score:', result.response.confidence);
    
    // Access visualizations
    result.response.visualizations.forEach(viz => {
      console.log(`Visualization: ${viz.title} - ${viz.image_url}`);
    });
    
    return result;
  } catch (error) {
    console.error('Error analyzing data:', error);
    return null;
  }
}
```

**Python SDK**
```python
# Installation
# pip install queryhive-sdk

# Usage
from queryhive import QueryHive

queryhive = QueryHive(
    api_key='YOUR_API_KEY',
    base_url='https://api.queryhive.ai/v1'
)

# Upload dataset
def upload_dataset(file_path, name, description):
    try:
        # Create dataset
        dataset = queryhive.datasets.create(
            name=name,
            description=description,
            tags=['python', 'sdk', 'demo']
        )
        
        # Upload file
        queryhive.datasets.upload_file(
            dataset_id=dataset['id'],
            file_path=file_path
        )
        
        # Wait for processing to complete
        dataset = queryhive.datasets.wait_for_processing(dataset['id'])
        
        print(f"Dataset uploaded and processed: {dataset['id']}")
        print(f"Rows: {dataset['row_count']}, Columns: {dataset['column_count']}")
        print(f"Quality score: {dataset['quality_score']}")
        
        return dataset
    except Exception as e:
        print(f"Error uploading dataset: {e}")
        return None

# Run ML model
def run_clustering(dataset_id):
    try:
        result = queryhive.ai.models.run(
            dataset_id=dataset_id,
            model_type='clustering',
            parameters={
                'n_clusters': 3,
                'random_state': 42
            }
        )
        
        print(f"Clustering completed with {len(result['results']['clusters'])} clusters")
        for i, cluster in enumerate(result['results']['clusters']):
            print(f"Cluster {i+1}: {cluster['size']} members, {cluster['percentage']}% of data")
            print(f"Centroid: {cluster['centroid']}")
        
        return result
    except Exception as e:
        print(f"Error running clustering: {e}")
        return None
```

## Integration Patterns

### ETL Integration

**Data Pipeline Integration**
```python
# Example: Integrating with Airflow
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from queryhive import QueryHive

queryhive = QueryHive(api_key='YOUR_API_KEY')

def extract_data():
    # Extract data from source system
    # ...
    return data_file_path

def upload_to_queryhive(data_file_path):
    # Create dataset
    dataset = queryhive.datasets.create(
        name=f"Sales Data {datetime.now().strftime('%Y-%m-%d')}",
        description="Daily sales data upload"
    )
    
    # Upload file
    queryhive.datasets.upload_file(
        dataset_id=dataset['id'],
        file_path=data_file_path
    )
    
    # Wait for processing
    dataset = queryhive.datasets.wait_for_processing(dataset['id'])
    
    return dataset['id']

def run_daily_analysis(dataset_id):
    # Run standard analyses
    queryhive.ai.query({
        "dataset_id": dataset_id,
        "query": "What are today's sales highlights?",
        "response_format": "detailed"
    })
    
    # Run ML models
    queryhive.ai.models.run({
        "dataset_id": dataset_id,
        "model_type": "anomaly_detection",
        "parameters": {
            "sensitivity": "medium"
        }
    })
    
    return True

# Define DAG
default_args = {
    'owner': 'data_team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

with DAG('queryhive_daily_sales_analysis',
         default_args=default_args,
         schedule_interval='0 6 * * *',
         catchup=False) as dag:
    
    extract_task = PythonOperator(
        task_id='extract_data',
        python_callable=extract_data
    )
    
    upload_task = PythonOperator(
        task_id='upload_to_queryhive',
        python_callable=upload_to_queryhive,
        op_args=['{{ task_instance.xcom_pull(task_ids="extract_data") }}']
    )
    
    analyze_task = PythonOperator(
        task_id='run_daily_analysis',
        python_callable=run_daily_analysis,
        op_args=['{{ task_instance.xcom_pull(task_ids="upload_to_queryhive") }}']
    )
    
    extract_task >> upload_task >> analyze_task
```

### Embedded Analytics

**Dashboard Embedding**
```html
<!-- HTML Embedding -->
<!DOCTYPE html>
<html>
<head>
  <title>Embedded Analytics</title>
  <style>
    .dashboard-container {
      width: 100%;
      height: 800px;
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>Sales Performance Dashboard</h1>
  
  <div id="dashboard-container"></div>
  
  <script src="https://cdn.queryhive.ai/embed/v1/queryhive-embed.js"></script>
  <script>
    // Initialize embedded dashboard
    const dashboard = QueryHiveEmbed.createDashboard({
      container: '#dashboard-container',
      dashboardId: 'dash_98765',
      apiKey: 'YOUR_PUBLIC_API_KEY',
      theme: 'light',
      filters: {
        date_range: {
          start: '2024-01-01',
          end: '2024-03-31'
        },
        region: 'North'
      },
      onLoad: () => {
        console.log('Dashboard loaded successfully');
      },
      onError: (error) => {
        console.error('Dashboard loading error:', error);
      }
    });
    
    // Update filters dynamically
    function updateDateRange(start, end) {
      dashboard.setFilters({
        date_range: { start, end }
      });
    }
    
    // Listen for dashboard events
    dashboard.on('filterChanged', (filter) => {
      console.log('Filter changed:', filter);
    });
    
    dashboard.on('dataPointClick', (data) => {
      console.log('Data point clicked:', data);
      // Trigger application-specific action
    });
  </script>
</body>
</html>
```

**Custom Visualization Integration**
```javascript
// React component example
import React, { useEffect, useState } from 'react';
import { QueryHive } from 'queryhive-sdk';

const queryhive = new QueryHive({
  apiKey: 'YOUR_API_KEY'
});

function SalesAnalysisDashboard({ datasetId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        
        // Run analysis
        const result = await queryhive.ai.query({
          dataset_id: datasetId,
          query: "What are the sales trends by region over the last 6 months?",
          include_visualizations: true
        });
        
        setAnalysisResult(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchAnalysis();
  }, [datasetId]);
  
  if (loading) return <div>Loading analysis...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="analysis-dashboard">
      <h2>Sales Analysis</h2>
      
      <div className="insight-summary">
        <p>{analysisResult.response.text}</p>
        <div className="confidence">
          Confidence: {(analysisResult.response.confidence * 100).toFixed(1)}%
        </div>
      </div>
      
      <div className="visualizations">
        {analysisResult.response.visualizations.map(viz => (
          <div key={viz.title} className="visualization-card">
            <h3>{viz.title}</h3>
            {viz.type === 'line_chart' ? (
              <iframe
                src={viz.interactive_url}
                width="100%"
                height="400"
                frameBorder="0"
              />
            ) : (
              <img src={viz.image_url} alt={viz.title} />
            )}
          </div>
        ))}
      </div>
      
      <div className="data-table">
        <h3>Regional Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Growth Rate</th>
              <th>Current Month</th>
              <th>Previous Month</th>
            </tr>
          </thead>
          <tbody>
            {analysisResult.response.data.regional_trends.map(region => (
              <tr key={region.region}>
                <td>{region.region}</td>
                <td>{(region.growth_rate * 100).toFixed(1)}%</td>
                <td>${region.current_month.toLocaleString()}</td>
                <td>${region.previous_month.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesAnalysisDashboard;
```

## Best Practices

### Performance Optimization

**Efficient API Usage**
```
Optimization Strategies:
1. Minimize API calls
   • Batch operations when possible
   • Cache responses with appropriate TTL
   • Use conditional requests (If-Modified-Since)

2. Optimize request size
   • Request only needed fields
   • Use pagination for large datasets
   • Compress request bodies

3. Handle responses efficiently
   • Stream large responses
   • Process data incrementally
   • Implement parallel processing
```

**Caching Strategy**
```javascript
// Example caching implementation
class QueryHiveCache {
  constructor(ttlSeconds = 300) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }
  
  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }
  
  invalidate(key) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage with API client
const cache = new QueryHiveCache(300); // 5-minute TTL

async function getCachedDataset(datasetId) {
  const cacheKey = `dataset:${datasetId}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    console.log('Cache hit for dataset');
    return cachedData;
  }
  
  console.log('Cache miss, fetching from API');
  const dataset = await queryhive.datasets.get(datasetId);
  cache.set(cacheKey, dataset);
  
  return dataset;
}
```

### Security Recommendations

**API Key Protection**
```
Security Measures:
1. Never expose API keys in client-side code
2. Use environment variables for key storage
3. Implement key rotation policies
4. Create separate keys for different environments
5. Use least-privilege keys when possible

Server-Side Authentication:
// Node.js example with environment variables
require('dotenv').config();
const { QueryHive } = require('queryhive-sdk');

const queryhive = new QueryHive({
  apiKey: process.env.QUERYHIVE_API_KEY
});

// API proxy endpoint
app.get('/api/datasets', async (req, res) => {
  try {
    // Authenticate user with your application
    if (!isUserAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Proxy request to QueryHive API
    const datasets = await queryhive.datasets.list();
    
    // Return data to client
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Data Privacy**
```
Privacy Considerations:
1. Minimize sensitive data transmission
2. Implement field-level filtering
3. Apply data masking when needed
4. Respect user consent and preferences
5. Comply with relevant regulations

Example: Filtering Sensitive Data
// Before sending to API
function removeSensitiveData(data) {
  const sensitiveFields = ['ssn', 'credit_card', 'password'];
  
  return data.map(record => {
    const filtered = { ...record };
    
    sensitiveFields.forEach(field => {
      if (field in filtered) {
        filtered[field] = '[REDACTED]';
      }
    });
    
    return filtered;
  });
}

const safeData = removeSensitiveData(rawData);
await queryhive.datasets.create({
  name: 'Customer Data',
  data: safeData
});
```

### Error Handling

**Robust Error Management**
```javascript
// Comprehensive error handling example
async function runAnalysis(datasetId, query) {
  try {
    // Validate inputs
    if (!datasetId || !query) {
      throw new Error('Missing required parameters');
    }
    
    // Check dataset exists
    try {
      await queryhive.datasets.get(datasetId);
    } catch (error) {
      if (error.code === 'not_found') {
        throw new Error(`Dataset ${datasetId} not found`);
      }
      throw error;
    }
    
    // Run analysis with retry logic
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        return await queryhive.ai.query({
          dataset_id: datasetId,
          query: query
        });
      } catch (error) {
        // Don't retry certain errors
        if (error.code === 'validation_error' || 
            error.code === 'not_found' ||
            error.code === 'insufficient_permissions') {
          throw error;
        }
        
        // Retry service errors with backoff
        if (error.code === 'service_unavailable' || 
            error.code === 'internal_error' ||
            error.code === 'rate_limit_exceeded') {
          retries++;
          if (retries >= maxRetries) throw error;
          
          const backoffTime = Math.pow(2, retries) * 1000;
          console.log(`Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }
        
        // Unknown error
        throw error;
      }
    }
  } catch (error) {
    // Log error with context
    console.error('Analysis error:', {
      message: error.message,
      code: error.code,
      datasetId,
      timestamp: new Date().toISOString()
    });
    
    // Rethrow with context
    throw new Error(`Analysis failed: ${error.message}`);
  }
}
```

## API Changelog and Versioning

### Version History

**Current Version: v1 (2024-01-01)**
```
Initial stable release with core functionality:
• Datasets API
• AI Analytics API
• Insights API
• Dashboards API
• Webhooks
```

**Upcoming: v1.1 (Q2 2024)**
```
Planned enhancements:
• Batch operations for datasets
• Enhanced ML model parameters
• Additional visualization types
• Improved error reporting
• Performance optimizations
```

**Future: v2 (Q4 2024)**
```
Major features planned:
• Real-time data streaming
• Advanced knowledge graph capabilities
• Custom ML model deployment
• Enhanced collaboration features
• Expanded webhook events
```

### Deprecation Policy

**Policy Overview**
```
Deprecation Timeline:
• Announcement: Minimum 6 months notice
• Deprecation Period: Features remain available but marked deprecated
• Sunset: Feature removed after deprecation period

Communication Channels:
• Email notifications to API users
• API changelog documentation
• Deprecation headers in API responses
• Developer dashboard notifications
```

**Handling Deprecated Features**
```
Deprecation Response Header:
X-QueryHive-Deprecation: The 'format' parameter is deprecated and will be removed on 2024-07-01. Use 'response_format' instead.

Migration Guides:
Detailed documentation provided for all deprecated features, including:
• Reason for deprecation
• Recommended alternatives
• Code migration examples
• Testing procedures
```

---

**Estimated Reading Time**: 30 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: API development experience  
**Last Updated**: January 2025