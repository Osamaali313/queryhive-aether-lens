# Webhooks & Events

Master the art of real-time integration with QueryHive AI using webhooks and event-driven architecture. This comprehensive guide covers everything from basic setup to advanced patterns for building responsive, integrated systems.

## Introduction to Webhooks

Webhooks provide a way for QueryHive AI to send real-time notifications to your systems when specific events occur. Unlike traditional APIs where you need to poll for updates, webhooks push data to your application as events happen, enabling efficient and timely integrations.

### Key Benefits

**Real-Time Updates**
- Immediate notification of events
- No polling required
- Reduced latency for critical processes
- Event-driven architecture support

**Efficient Integration**
- Minimized API calls
- Reduced system load
- Optimized resource usage
- Streamlined data flows

**Automation Enablement**
- Trigger automated workflows
- React to system events
- Build event-driven pipelines
- Create responsive applications

### How Webhooks Work

**Basic Flow**
```
1. You register a webhook URL with QueryHive AI
2. An event occurs in the system (e.g., analysis completed)
3. QueryHive AI sends an HTTP POST request to your URL
4. Your server processes the webhook payload
5. Your server returns a 2xx response to acknowledge receipt
```

**Technical Implementation**
```
┌─────────────────┐                 ┌─────────────────┐
│                 │                 │                 │
│   QueryHive AI  │                 │  Your Server    │
│                 │                 │                 │
└────────┬────────┘                 └────────┬────────┘
         │                                   │
         │  1. Register webhook URL          │
         │ <──────────────────────────────── │
         │                                   │
         │  2. Event occurs                  │
         │  (e.g., analysis completed)       │
         │                                   │
         │  3. HTTP POST with event payload  │
         │ ────────────────────────────────> │
         │                                   │
         │  4. Process webhook data          │
         │                                   │
         │  5. Return 2xx response           │
         │ <──────────────────────────────── │
         │                                   │
```

## Webhook Events

### Available Event Types

**Dataset Events**
```
dataset.created
• Triggered when: New dataset is created
• Use cases: Track new data uploads, trigger processing pipelines
• Payload includes: Dataset ID, name, metadata, creator information

dataset.updated
• Triggered when: Dataset metadata is modified
• Use cases: Sync external systems, update catalogs
• Payload includes: Updated fields, previous values, change author

dataset.deleted
• Triggered when: Dataset is deleted
• Use cases: Clean up related resources, update inventories
• Payload includes: Dataset ID, deletion timestamp, deletion author

dataset.processing.started
• Triggered when: Data processing begins
• Use cases: Track processing status, update progress indicators
• Payload includes: Dataset ID, processing job ID, estimated duration

dataset.processing.completed
• Triggered when: Data processing finishes successfully
• Use cases: Trigger dependent analyses, update status dashboards
• Payload includes: Dataset ID, processing results, quality metrics

dataset.processing.failed
• Triggered when: Data processing encounters an error
• Use cases: Alert systems, trigger fallback processes
• Payload includes: Dataset ID, error details, failure reason
```

**Analysis Events**
```
analysis.started
• Triggered when: Analysis job begins
• Use cases: Track analysis progress, update status indicators
• Payload includes: Analysis ID, dataset ID, query details

analysis.completed
• Triggered when: Analysis job finishes successfully
• Use cases: Notify stakeholders, update dashboards, trigger actions
• Payload includes: Analysis ID, results summary, performance metrics

analysis.failed
• Triggered when: Analysis job encounters an error
• Use cases: Alert systems, trigger fallback analyses
• Payload includes: Analysis ID, error details, failure reason
```

**Insight Events**
```
insight.created
• Triggered when: New insight is generated
• Use cases: Notify stakeholders, update knowledge base
• Payload includes: Insight ID, title, summary, confidence score

insight.updated
• Triggered when: Insight is modified
• Use cases: Track changes, update dependent systems
• Payload includes: Updated fields, previous values, change author

insight.deleted
• Triggered when: Insight is deleted
• Use cases: Clean up related resources, update inventories
• Payload includes: Insight ID, deletion timestamp, deletion author

insight.shared
• Triggered when: Insight is shared with users
• Use cases: Notify recipients, track sharing activity
• Payload includes: Insight ID, recipient details, sharing settings
```

**Dashboard Events**
```
dashboard.created
• Triggered when: New dashboard is created
• Use cases: Track dashboard creation, update catalogs
• Payload includes: Dashboard ID, name, creator information

dashboard.updated
• Triggered when: Dashboard is modified
• Use cases: Track changes, notify stakeholders
• Payload includes: Updated components, previous state, change author

dashboard.shared
• Triggered when: Dashboard is shared with users
• Use cases: Notify recipients, track sharing activity
• Payload includes: Dashboard ID, recipient details, sharing settings

dashboard.viewed
• Triggered when: Dashboard is viewed by a user
• Use cases: Track usage analytics, optimize content
• Payload includes: Dashboard ID, viewer information, view duration
```

**User Events**
```
user.created
• Triggered when: New user is created
• Use cases: Onboarding workflows, user provisioning
• Payload includes: User ID, email, role information

user.updated
• Triggered when: User profile or permissions change
• Use cases: Sync with external systems, audit changes
• Payload includes: Updated fields, previous values

user.deleted
• Triggered when: User is deleted
• Use cases: Clean up related resources, revoke access
• Payload includes: User ID, deletion timestamp

user.login
• Triggered when: User logs in
• Use cases: Security monitoring, usage analytics
• Payload includes: User ID, login timestamp, device information
```

### Event Payload Structure

**Standard Payload Format**
```json
{
  "event": "dataset.processing.completed",
  "id": "evt_12345",
  "created_at": "2024-01-20T15:30:00Z",
  "webhook_id": "wh_67890",
  "api_version": "v1",
  "data": {
    "id": "ds_54321",
    "name": "Sales Data 2024",
    "processing": {
      "status": "completed",
      "duration_ms": 12547,
      "started_at": "2024-01-20T15:25:00Z",
      "completed_at": "2024-01-20T15:30:00Z",
      "quality_score": 0.94,
      "row_count": 10247,
      "column_count": 15,
      "issues_detected": 12,
      "warnings": 3
    },
    "created_by": {
      "id": "user_9876",
      "name": "John Smith",
      "email": "john@example.com"
    }
  }
}
```

**Event-Specific Payload Examples**

*Analysis Completed Event*
```json
{
  "event": "analysis.completed",
  "id": "evt_23456",
  "created_at": "2024-01-20T16:45:00Z",
  "webhook_id": "wh_67890",
  "api_version": "v1",
  "data": {
    "id": "an_87654",
    "dataset_id": "ds_54321",
    "type": "natural_language_query",
    "query": "What are the sales trends by region?",
    "status": "completed",
    "duration_ms": 3456,
    "results": {
      "summary": "Sales have increased across all regions with North showing the highest growth at 23.4%",
      "confidence": 0.94,
      "has_visualizations": true,
      "insight_count": 3
    },
    "requested_by": {
      "id": "user_9876",
      "name": "John Smith"
    },
    "resource_url": "https://api.queryhive.ai/v1/analyses/an_87654"
  }
}
```

*Insight Created Event*
```json
{
  "event": "insight.created",
  "id": "evt_34567",
  "created_at": "2024-01-20T16:50:00Z",
  "webhook_id": "wh_67890",
  "api_version": "v1",
  "data": {
    "id": "ins_76543",
    "dataset_id": "ds_54321",
    "analysis_id": "an_87654",
    "type": "trend_analysis",
    "title": "Regional Sales Growth Trends",
    "summary": "North region shows exceptional growth at 23.4%, outperforming all other regions",
    "confidence_score": 0.94,
    "created_by": {
      "id": "user_9876",
      "name": "John Smith"
    },
    "tags": ["sales", "regional", "trends", "growth"],
    "resource_url": "https://api.queryhive.ai/v1/insights/ins_76543"
  }
}
```

*Dashboard Shared Event*
```json
{
  "event": "dashboard.shared",
  "id": "evt_45678",
  "created_at": "2024-01-20T17:15:00Z",
  "webhook_id": "wh_67890",
  "api_version": "v1",
  "data": {
    "id": "dash_65432",
    "name": "Executive Sales Dashboard",
    "shared_by": {
      "id": "user_9876",
      "name": "John Smith"
    },
    "shared_with": [
      {
        "type": "user",
        "id": "user_5432",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "permission": "view"
      },
      {
        "type": "team",
        "id": "team_8765",
        "name": "Executive Team",
        "member_count": 5,
        "permission": "view"
      }
    ],
    "sharing_settings": {
      "allow_export": true,
      "allow_comments": true,
      "expiration": null,
      "is_public": false
    },
    "resource_url": "https://api.queryhive.ai/v1/dashboards/dash_65432"
  }
}
```

## Setting Up Webhooks

### Webhook Registration

**Creating a Webhook**
```
POST /webhooks

Request Body:
{
  "url": "https://example.com/webhooks/queryhive",
  "events": [
    "dataset.processing.completed",
    "analysis.completed",
    "insight.created"
  ],
  "description": "Production data pipeline integration",
  "secret": "whsec_abcdefghijklmnopqrstuvwxyz123456",
  "active": true,
  "metadata": {
    "environment": "production",
    "owner": "data-engineering-team",
    "priority": "high"
  }
}

Response:
{
  "id": "wh_67890",
  "url": "https://example.com/webhooks/queryhive",
  "events": [
    "dataset.processing.completed",
    "analysis.completed",
    "insight.created"
  ],
  "description": "Production data pipeline integration",
  "active": true,
  "created_at": "2024-01-20T14:30:00Z",
  "updated_at": "2024-01-20T14:30:00Z",
  "metadata": {
    "environment": "production",
    "owner": "data-engineering-team",
    "priority": "high"
  }
}
```

**Listing Webhooks**
```
GET /webhooks

Response:
{
  "data": [
    {
      "id": "wh_67890",
      "url": "https://example.com/webhooks/queryhive",
      "events": [
        "dataset.processing.completed",
        "analysis.completed",
        "insight.created"
      ],
      "description": "Production data pipeline integration",
      "active": true,
      "created_at": "2024-01-20T14:30:00Z",
      "updated_at": "2024-01-20T14:30:00Z",
      "last_delivery": {
        "status": "success",
        "timestamp": "2024-01-20T15:30:00Z",
        "event": "dataset.processing.completed"
      }
    },
    {
      "id": "wh_67891",
      "url": "https://staging.example.com/webhooks/queryhive",
      "events": [
        "dataset.processing.completed",
        "analysis.completed"
      ],
      "description": "Staging environment integration",
      "active": true,
      "created_at": "2024-01-19T10:15:00Z",
      "updated_at": "2024-01-19T10:15:00Z",
      "last_delivery": {
        "status": "failed",
        "timestamp": "2024-01-20T12:45:00Z",
        "event": "analysis.completed"
      }
    }
  ],
  "meta": {
    "total_count": 2,
    "page": 1,
    "limit": 20
  }
}
```

**Updating a Webhook**
```
PATCH /webhooks/{webhook_id}

Request Body:
{
  "events": [
    "dataset.processing.completed",
    "analysis.completed",
    "insight.created",
    "dashboard.shared"
  ],
  "description": "Updated production data pipeline integration",
  "active": true
}

Response:
{
  "id": "wh_67890",
  "url": "https://example.com/webhooks/queryhive",
  "events": [
    "dataset.processing.completed",
    "analysis.completed",
    "insight.created",
    "dashboard.shared"
  ],
  "description": "Updated production data pipeline integration",
  "active": true,
  "created_at": "2024-01-20T14:30:00Z",
  "updated_at": "2024-01-20T16:45:00Z"
}
```

**Deleting a Webhook**
```
DELETE /webhooks/{webhook_id}

Response:
{
  "id": "wh_67890",
  "deleted": true,
  "deleted_at": "2024-01-20T17:30:00Z"
}
```

### Webhook Security

**Generating a Webhook Secret**
```
// Node.js example
const crypto = require('crypto');

function generateWebhookSecret() {
  // Generate 32 random bytes and convert to hex
  return 'whsec_' + crypto.randomBytes(32).toString('hex');
}

const secret = generateWebhookSecret();
console.log('Webhook Secret:', secret);
// Example output: whsec_8f9a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1
```

**Verifying Webhook Signatures**
```javascript
// Node.js example with Express
const express = require('express');
const crypto = require('crypto');
const app = express();

// Your webhook secret from QueryHive dashboard
const WEBHOOK_SECRET = 'whsec_abcdefghijklmnopqrstuvwxyz123456';

// Middleware to verify webhook signatures
function verifyQueryHiveWebhook(req, res, next) {
  const signature = req.headers['x-queryhive-signature'];
  const timestamp = req.headers['x-queryhive-timestamp'];
  
  if (!signature || !timestamp) {
    return res.status(401).send('Missing signature or timestamp');
  }
  
  // Check if timestamp is recent (within 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(timestamp) > 300) {
    return res.status(401).send('Timestamp too old');
  }
  
  // Get raw request body
  const payload = req.rawBody;
  
  // Create expected signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  // Compare signatures using constant-time comparison
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    return res.status(401).send('Invalid signature');
  }
  
  // Signature is valid, proceed
  next();
}

// Express middleware to capture raw body
app.use('/webhooks/queryhive', express.raw({ type: 'application/json' }), (req, res, next) => {
  req.rawBody = req.body.toString();
  req.body = JSON.parse(req.rawBody);
  next();
});

// Webhook endpoint with verification
app.post('/webhooks/queryhive', verifyQueryHiveWebhook, (req, res) => {
  const event = req.body;
  
  console.log('Received verified webhook:', event.event);
  
  // Process different event types
  switch (event.event) {
    case 'dataset.processing.completed':
      handleDatasetProcessed(event.data);
      break;
    case 'analysis.completed':
      handleAnalysisCompleted(event.data);
      break;
    case 'insight.created':
      handleInsightCreated(event.data);
      break;
    default:
      console.log('Unhandled event type:', event.event);
  }
  
  // Acknowledge receipt
  res.status(200).send('Webhook received');
});

function handleDatasetProcessed(data) {
  console.log(`Dataset ${data.id} processed with quality score ${data.processing.quality_score}`);
  // Trigger dependent processes
}

function handleAnalysisCompleted(data) {
  console.log(`Analysis ${data.id} completed with confidence ${data.results.confidence}`);
  // Update dashboards or notify users
}

function handleInsightCreated(data) {
  console.log(`New insight created: ${data.title}`);
  // Add to knowledge base or notify stakeholders
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

**Python Implementation**
```python
# Flask example
from flask import Flask, request, jsonify
import hmac
import hashlib
import time

app = Flask(__name__)

# Your webhook secret from QueryHive dashboard
WEBHOOK_SECRET = 'whsec_abcdefghijklmnopqrstuvwxyz123456'

def verify_signature(payload, signature, timestamp):
    """Verify the webhook signature."""
    if not signature or not timestamp:
        return False
    
    # Check if timestamp is recent (within 5 minutes)
    now = int(time.time())
    if now - int(timestamp) > 300:
        return False
    
    # Create expected signature
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        f"{timestamp}.{payload}".encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Compare signatures (constant-time comparison)
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhooks/queryhive', methods=['POST'])
def webhook_handler():
    # Get signature and timestamp from headers
    signature = request.headers.get('X-QueryHive-Signature')
    timestamp = request.headers.get('X-QueryHive-Timestamp')
    
    # Get raw request body
    payload = request.data.decode('utf-8')
    
    # Verify signature
    if not verify_signature(payload, signature, timestamp):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Parse JSON payload
    event = request.json
    
    print(f"Received verified webhook: {event['event']}")
    
    # Process different event types
    if event['event'] == 'dataset.processing.completed':
        handle_dataset_processed(event['data'])
    elif event['event'] == 'analysis.completed':
        handle_analysis_completed(event['data'])
    elif event['event'] == 'insight.created':
        handle_insight_created(event['data'])
    else:
        print(f"Unhandled event type: {event['event']}")
    
    # Acknowledge receipt
    return jsonify({'status': 'success'}), 200

def handle_dataset_processed(data):
    print(f"Dataset {data['id']} processed with quality score {data['processing']['quality_score']}")
    # Trigger dependent processes

def handle_analysis_completed(data):
    print(f"Analysis {data['id']} completed with confidence {data['results']['confidence']}")
    # Update dashboards or notify users

def handle_insight_created(data):
    print(f"New insight created: {data['title']}")
    # Add to knowledge base or notify stakeholders

if __name__ == '__main__':
    app.run(port=3000)
```

## Webhook Management

### Monitoring and Debugging

**Viewing Webhook Delivery History**
```
GET /webhooks/{webhook_id}/deliveries

Response:
{
  "data": [
    {
      "id": "whd_12345",
      "webhook_id": "wh_67890",
      "event": "dataset.processing.completed",
      "status": "success",
      "request": {
        "url": "https://example.com/webhooks/queryhive",
        "headers": {
          "Content-Type": "application/json",
          "User-Agent": "QueryHive-Webhook/1.0",
          "X-QueryHive-Signature": "abcdef1234567890",
          "X-QueryHive-Timestamp": "1642687800"
        },
        "body_size_bytes": 1247
      },
      "response": {
        "status_code": 200,
        "headers": {
          "Content-Type": "application/json",
          "Server": "nginx/1.18.0"
        },
        "body": "{\"status\":\"success\"}",
        "processing_time_ms": 124
      },
      "created_at": "2024-01-20T15:30:00Z"
    },
    {
      "id": "whd_12346",
      "webhook_id": "wh_67890",
      "event": "analysis.completed",
      "status": "failed",
      "request": {
        "url": "https://example.com/webhooks/queryhive",
        "headers": {
          "Content-Type": "application/json",
          "User-Agent": "QueryHive-Webhook/1.0",
          "X-QueryHive-Signature": "abcdef1234567891",
          "X-QueryHive-Timestamp": "1642691400"
        },
        "body_size_bytes": 1548
      },
      "response": {
        "status_code": 500,
        "headers": {
          "Content-Type": "application/json",
          "Server": "nginx/1.18.0"
        },
        "body": "{\"error\":\"Internal server error\"}",
        "processing_time_ms": 2547
      },
      "retry_count": 3,
      "next_retry_at": null,
      "created_at": "2024-01-20T16:30:00Z"
    }
  ],
  "meta": {
    "total_count": 127,
    "page": 1,
    "limit": 20
  }
}
```

**Webhook Delivery Details**
```
GET /webhooks/{webhook_id}/deliveries/{delivery_id}

Response:
{
  "id": "whd_12345",
  "webhook_id": "wh_67890",
  "event": "dataset.processing.completed",
  "status": "success",
  "request": {
    "url": "https://example.com/webhooks/queryhive",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "User-Agent": "QueryHive-Webhook/1.0",
      "X-QueryHive-Signature": "abcdef1234567890",
      "X-QueryHive-Timestamp": "1642687800",
      "X-QueryHive-Event": "dataset.processing.completed",
      "X-QueryHive-Delivery": "whd_12345"
    },
    "body": "{\"event\":\"dataset.processing.completed\",\"id\":\"evt_12345\",\"created_at\":\"2024-01-20T15:30:00Z\",\"webhook_id\":\"wh_67890\",\"api_version\":\"v1\",\"data\":{\"id\":\"ds_54321\",\"name\":\"Sales Data 2024\",\"processing\":{\"status\":\"completed\",\"duration_ms\":12547,\"started_at\":\"2024-01-20T15:25:00Z\",\"completed_at\":\"2024-01-20T15:30:00Z\",\"quality_score\":0.94,\"row_count\":10247,\"column_count\":15,\"issues_detected\":12,\"warnings\":3},\"created_by\":{\"id\":\"user_9876\",\"name\":\"John Smith\",\"email\":\"john@example.com\"}}}"
  },
  "response": {
    "status_code": 200,
    "headers": {
      "Content-Type": "application/json",
      "Server": "nginx/1.18.0",
      "Date": "Fri, 20 Jan 2024 15:30:01 GMT",
      "Content-Length": "21"
    },
    "body": "{\"status\":\"success\"}",
    "processing_time_ms": 124
  },
  "retry_count": 0,
  "created_at": "2024-01-20T15:30:00Z"
}
```

**Webhook Health Dashboard**
```
GET /webhooks/{webhook_id}/health

Response:
{
  "id": "wh_67890",
  "url": "https://example.com/webhooks/queryhive",
  "health": {
    "status": "healthy",
    "success_rate": 0.98,
    "average_response_time_ms": 145,
    "last_24_hours": {
      "delivery_count": 127,
      "success_count": 124,
      "failure_count": 3,
      "success_rate": 0.98
    },
    "last_7_days": {
      "delivery_count": 843,
      "success_count": 821,
      "failure_count": 22,
      "success_rate": 0.97
    }
  },
  "event_stats": [
    {
      "event": "dataset.processing.completed",
      "count": 45,
      "success_rate": 1.0,
      "average_response_time_ms": 132
    },
    {
      "event": "analysis.completed",
      "count": 67,
      "success_rate": 0.95,
      "average_response_time_ms": 156
    },
    {
      "event": "insight.created",
      "count": 15,
      "success_rate": 1.0,
      "average_response_time_ms": 128
    }
  ],
  "recent_failures": [
    {
      "id": "whd_12346",
      "event": "analysis.completed",
      "status_code": 500,
      "error": "Internal server error",
      "timestamp": "2024-01-20T16:30:00Z"
    },
    {
      "id": "whd_12340",
      "event": "analysis.completed",
      "status_code": 500,
      "error": "Internal server error",
      "timestamp": "2024-01-20T14:15:00Z"
    },
    {
      "id": "whd_12335",
      "event": "analysis.completed",
      "status_code": 500,
      "error": "Internal server error",
      "timestamp": "2024-01-20T12:45:00Z"
    }
  ]
}
```

### Testing and Troubleshooting

**Sending Test Events**
```
POST /webhooks/{webhook_id}/test

Request Body:
{
  "event": "dataset.processing.completed",
  "data": {
    "id": "ds_test123",
    "name": "Test Dataset",
    "processing": {
      "status": "completed",
      "duration_ms": 1234,
      "quality_score": 0.95,
      "row_count": 1000,
      "column_count": 10
    }
  }
}

Response:
{
  "success": true,
  "delivery_id": "whd_test456",
  "status": "delivered",
  "response": {
    "status_code": 200,
    "body": "{\"status\":\"success\"}",
    "processing_time_ms": 135
  }
}
```

**Common Webhook Issues**

*Connection Failures*
```
Problem: Webhook server unreachable
Symptoms:
• Connection timeout
• DNS resolution failure
• TLS/SSL errors

Troubleshooting:
1. Verify server is running and accessible
2. Check DNS configuration
3. Validate SSL certificate
4. Test with curl or Postman
5. Check firewall and network settings

Example curl test:
curl -X POST https://example.com/webhooks/queryhive \
  -H "Content-Type: application/json" \
  -d '{"test":"payload"}'
```

*Authentication Failures*
```
Problem: Signature verification fails
Symptoms:
• 401 Unauthorized responses
• Signature validation errors
• Timestamp validation failures

Troubleshooting:
1. Verify webhook secret matches
2. Check signature calculation logic
3. Validate timestamp handling
4. Ensure raw body is used for verification
5. Check for body parsing middleware issues

Common Issues:
• Body parsing middleware modifying the raw body
• Incorrect secret format or encoding
• Clock synchronization problems
• Incorrect signature algorithm
```

*Processing Errors*
```
Problem: Webhook received but processing fails
Symptoms:
• 5xx responses from your server
• Exceptions in webhook handler
• Timeout during processing

Troubleshooting:
1. Check server logs for exceptions
2. Verify payload structure handling
3. Test with simplified payloads
4. Add more error handling
5. Implement request logging

Best Practices:
• Separate reception from processing
• Acknowledge quickly, process asynchronously
• Implement comprehensive logging
• Use try/catch blocks around all processing
• Set up monitoring and alerting
```

## Advanced Webhook Patterns

### Reliability and Resilience

**Idempotent Processing**
```javascript
// Ensure webhook processing is idempotent
function processWebhook(event) {
  // Extract event ID for idempotency check
  const eventId = event.id;
  
  // Check if event was already processed
  if (hasProcessedEvent(eventId)) {
    console.log(`Event ${eventId} already processed, skipping`);
    return;
  }
  
  // Process based on event type
  switch (event.event) {
    case 'dataset.processing.completed':
      processDataset(event.data);
      break;
    case 'analysis.completed':
      processAnalysis(event.data);
      break;
    // Handle other event types...
  }
  
  // Mark event as processed
  markEventProcessed(eventId);
}

// Database functions for tracking processed events
function hasProcessedEvent(eventId) {
  // Check database for processed event
  // Return true if found, false otherwise
}

function markEventProcessed(eventId) {
  // Store event ID in database with timestamp
  // Include additional metadata if needed
}
```

**Asynchronous Processing**
```javascript
// Express.js example with async processing
const express = require('express');
const app = express();
const queue = require('./queue-service'); // Your queue implementation

app.post('/webhooks/queryhive', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-queryhive-signature'];
    const timestamp = req.headers['x-queryhive-timestamp'];
    const payload = req.body.toString();
    
    if (!verifySignature(payload, signature, timestamp)) {
      return res.status(401).send('Invalid signature');
    }
    
    // Parse event
    const event = JSON.parse(payload);
    
    // Acknowledge receipt immediately
    res.status(200).send('Webhook received');
    
    // Queue event for asynchronous processing
    await queue.enqueue('webhook-events', {
      id: event.id,
      type: event.event,
      data: event.data,
      received_at: new Date().toISOString()
    });
    
    console.log(`Queued event ${event.id} for processing`);
  } catch (error) {
    // Still acknowledge receipt to prevent retries
    // We've already responded if we got this far
    console.error('Error handling webhook:', error);
  }
});

// Worker process to handle queued events
async function processQueuedEvents() {
  while (true) {
    try {
      // Dequeue next event
      const event = await queue.dequeue('webhook-events');
      if (!event) {
        // No events, wait before checking again
        await sleep(1000);
        continue;
      }
      
      console.log(`Processing queued event ${event.id}`);
      
      // Process event based on type
      switch (event.type) {
        case 'dataset.processing.completed':
          await processDataset(event.data);
          break;
        case 'analysis.completed':
          await processAnalysis(event.data);
          break;
        // Handle other event types...
      }
      
      // Mark event as processed
      await markEventProcessed(event.id);
    } catch (error) {
      console.error('Error processing queued event:', error);
      // Implement error handling, retries, dead-letter queue, etc.
    }
  }
}

// Start worker process
processQueuedEvents().catch(error => {
  console.error('Worker process failed:', error);
  process.exit(1);
});
```

**Retry Handling**
```javascript
// Handling webhook retries
function processWebhook(event) {
  // Check for duplicate event processing
  const eventId = event.id;
  
  // Get existing processing record if any
  const existingProcess = getProcessingRecord(eventId);
  
  if (existingProcess) {
    if (existingProcess.status === 'completed') {
      // Already successfully processed
      console.log(`Event ${eventId} already processed successfully`);
      return;
    }
    
    if (existingProcess.status === 'failed') {
      // Previous attempt failed, this is a retry
      console.log(`Retrying failed event ${eventId}, attempt ${existingProcess.attempts + 1}`);
      
      // Update attempt count
      updateProcessingRecord(eventId, {
        attempts: existingProcess.attempts + 1,
        last_attempt: new Date().toISOString()
      });
    }
  } else {
    // First time seeing this event
    createProcessingRecord(eventId, {
      status: 'processing',
      attempts: 1,
      first_attempt: new Date().toISOString(),
      last_attempt: new Date().toISOString()
    });
  }
  
  try {
    // Process based on event type
    switch (event.event) {
      case 'dataset.processing.completed':
        processDataset(event.data);
        break;
      case 'analysis.completed':
        processAnalysis(event.data);
        break;
      // Handle other event types...
    }
    
    // Mark as completed
    updateProcessingRecord(eventId, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error processing event ${eventId}:`, error);
    
    // Mark as failed
    updateProcessingRecord(eventId, {
      status: 'failed',
      error: error.message,
      stack_trace: error.stack
    });
    
    // Rethrow or handle based on your error strategy
    throw error;
  }
}

// Database functions for tracking processing
function getProcessingRecord(eventId) {
  // Retrieve processing record from database
  // Return null if not found
}

function createProcessingRecord(eventId, data) {
  // Create new processing record in database
}

function updateProcessingRecord(eventId, data) {
  // Update existing processing record in database
}
```

### Event-Driven Architecture

**Webhook-Triggered Pipelines**
```javascript
// Example: Data processing pipeline triggered by webhook
async function handleDatasetProcessed(data) {
  // 1. Log event receipt
  console.log(`Dataset ${data.id} processed with quality score ${data.processing.quality_score}`);
  
  // 2. Store dataset metadata
  await storeDatasetMetadata(data);
  
  // 3. Trigger standard analyses
  if (data.processing.quality_score >= 0.8) {
    await triggerStandardAnalyses(data.id);
  } else {
    await notifyDataQualityIssues(data);
  }
  
  // 4. Update data catalog
  await updateDataCatalog(data);
  
  // 5. Notify stakeholders
  await notifyDatasetReady(data);
}

async function triggerStandardAnalyses(datasetId) {
  // Define standard analyses to run
  const standardAnalyses = [
    {
      type: 'natural_language_query',
      query: 'What are the key trends in this dataset?'
    },
    {
      type: 'ml_model',
      model: 'clustering',
      parameters: { n_clusters: 'auto' }
    },
    {
      type: 'ml_model',
      model: 'anomaly_detection',
      parameters: { sensitivity: 'medium' }
    }
  ];
  
  // Queue analyses for execution
  for (const analysis of standardAnalyses) {
    await queueAnalysis(datasetId, analysis);
  }
  
  console.log(`Queued ${standardAnalyses.length} standard analyses for dataset ${datasetId}`);
}

async function handleAnalysisCompleted(data) {
  // 1. Log analysis completion
  console.log(`Analysis ${data.id} completed with confidence ${data.results.confidence}`);
  
  // 2. Store analysis results
  await storeAnalysisResults(data);
  
  // 3. Update dashboards
  if (data.results.has_visualizations) {
    await updateDashboards(data);
  }
  
  // 4. Notify relevant users
  await notifyAnalysisCompleted(data);
  
  // 5. Trigger dependent processes
  if (data.type === 'anomaly_detection' && hasSignificantAnomalies(data)) {
    await triggerAnomalyAlerts(data);
  }
}
```

**Event Aggregation and Filtering**
```javascript
// Event filtering and routing system
class WebhookRouter {
  constructor() {
    this.handlers = new Map();
    this.filters = new Map();
  }
  
  // Register handler for specific event type
  on(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
    return this;
  }
  
  // Add filter for event type
  addFilter(eventType, filterFn) {
    if (!this.filters.has(eventType)) {
      this.filters.set(eventType, []);
    }
    this.filters.get(eventType).push(filterFn);
    return this;
  }
  
  // Process incoming webhook
  async process(event) {
    const eventType = event.event;
    
    // Check if we have handlers for this event type
    if (!this.handlers.has(eventType)) {
      console.log(`No handlers registered for event type: ${eventType}`);
      return;
    }
    
    // Apply filters if any
    let shouldProcess = true;
    if (this.filters.has(eventType)) {
      shouldProcess = this.filters.get(eventType).every(filter => filter(event));
    }
    
    if (!shouldProcess) {
      console.log(`Event ${event.id} filtered out`);
      return;
    }
    
    // Execute all handlers
    const handlers = this.handlers.get(eventType);
    for (const handler of handlers) {
      try {
        await handler(event.data, event);
      } catch (error) {
        console.error(`Error in handler for ${eventType}:`, error);
        // Implement error handling strategy
      }
    }
  }
}

// Usage example
const router = new WebhookRouter();

// Register handlers
router
  .on('dataset.processing.completed', handleDatasetProcessed)
  .on('analysis.completed', handleAnalysisCompleted)
  .on('insight.created', handleInsightCreated);

// Add filters
router
  .addFilter('dataset.processing.completed', event => 
    event.data.processing.quality_score >= 0.8)
  .addFilter('analysis.completed', event => 
    event.data.results.confidence >= 0.7);

// Express webhook endpoint
app.post('/webhooks/queryhive', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-queryhive-signature'];
    const timestamp = req.headers['x-queryhive-timestamp'];
    const payload = req.body.toString();
    
    if (!verifySignature(payload, signature, timestamp)) {
      return res.status(401).send('Invalid signature');
    }
    
    // Parse event
    const event = JSON.parse(payload);
    
    // Acknowledge receipt immediately
    res.status(200).send('Webhook received');
    
    // Process event asynchronously
    router.process(event).catch(error => {
      console.error('Error processing webhook:', error);
    });
  } catch (error) {
    // Still acknowledge receipt to prevent retries
    if (!res.headersSent) {
      res.status(200).send('Webhook received');
    }
    console.error('Error handling webhook:', error);
  }
});
```

**Event Correlation**
```javascript
// Correlating related events
class EventCorrelator {
  constructor(options = {}) {
    this.events = new Map();
    this.ttl = options.ttl || 3600000; // Default 1 hour TTL
    this.correlationRules = new Map();
    
    // Clean up expired events periodically
    setInterval(() => this.cleanupExpiredEvents(), this.ttl / 2);
  }
  
  // Add correlation rule
  addCorrelationRule(sourceEvent, targetEvent, correlationFn) {
    const key = `${sourceEvent}:${targetEvent}`;
    this.correlationRules.set(key, correlationFn);
  }
  
  // Process incoming event
  async processEvent(event) {
    // Store event with expiration
    const eventId = event.id;
    const eventType = event.event;
    
    this.events.set(eventId, {
      type: eventType,
      data: event.data,
      timestamp: Date.now(),
      expires: Date.now() + this.ttl,
      processed: false
    });
    
    // Check for correlations
    await this.checkCorrelations(event);
  }
  
  // Check if this event correlates with stored events
  async checkCorrelations(newEvent) {
    const newEventType = newEvent.event;
    
    // Check each stored event for potential correlations
    for (const [storedId, storedEvent] of this.events.entries()) {
      if (storedEvent.processed) continue;
      
      // Check if we have a rule for this pair
      const sourceToTarget = `${storedEvent.type}:${newEventType}`;
      const targetToSource = `${newEventType}:${storedEvent.type}`;
      
      if (this.correlationRules.has(sourceToTarget)) {
        const correlationFn = this.correlationRules.get(sourceToTarget);
        if (correlationFn(storedEvent.data, newEvent.data)) {
          await this.handleCorrelatedEvents(storedId, storedEvent, newEvent.id, newEvent);
        }
      }
      
      if (this.correlationRules.has(targetToSource)) {
        const correlationFn = this.correlationRules.get(targetToSource);
        if (correlationFn(newEvent.data, storedEvent.data)) {
          await this.handleCorrelatedEvents(newEvent.id, newEvent, storedId, storedEvent);
        }
      }
    }
  }
  
  // Handle correlated events
  async handleCorrelatedEvents(sourceId, sourceEvent, targetId, targetEvent) {
    console.log(`Correlation detected between ${sourceEvent.type} and ${targetEvent.event}`);
    
    // Mark events as processed
    const source = this.events.get(sourceId);
    if (source) source.processed = true;
    
    const target = this.events.get(targetId);
    if (target) target.processed = true;
    
    // Trigger correlated event processing
    try {
      // Example: Dataset processing completed followed by analysis completed
      if (sourceEvent.type === 'dataset.processing.completed' && 
          targetEvent.event === 'analysis.completed') {
        await handleDatasetAnalysisSequence(sourceEvent.data, targetEvent.data);
      }
      
      // Example: Analysis completed followed by insight created
      if (sourceEvent.type === 'analysis.completed' && 
          targetEvent.event === 'insight.created') {
        await handleAnalysisInsightSequence(sourceEvent.data, targetEvent.data);
      }
    } catch (error) {
      console.error('Error processing correlated events:', error);
    }
  }
  
  // Clean up expired events
  cleanupExpiredEvents() {
    const now = Date.now();
    for (const [id, event] of this.events.entries()) {
      if (event.expires <= now) {
        this.events.delete(id);
      }
    }
  }
}

// Usage example
const correlator = new EventCorrelator({ ttl: 3600000 }); // 1 hour TTL

// Add correlation rules
correlator.addCorrelationRule(
  'dataset.processing.completed',
  'analysis.completed',
  (datasetEvent, analysisEvent) => datasetEvent.id === analysisEvent.dataset_id
);

correlator.addCorrelationRule(
  'analysis.completed',
  'insight.created',
  (analysisEvent, insightEvent) => analysisEvent.id === insightEvent.analysis_id
);

// Process events in webhook handler
app.post('/webhooks/queryhive', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify and parse webhook
    // ...
    
    // Acknowledge receipt
    res.status(200).send('Webhook received');
    
    // Process with correlator
    await correlator.processEvent(event);
  } catch (error) {
    console.error('Error handling webhook:', error);
  }
});

// Correlated event handlers
async function handleDatasetAnalysisSequence(datasetEvent, analysisEvent) {
  console.log(`Complete sequence: Dataset ${datasetEvent.id} processed and analyzed`);
  // Handle the complete dataset processing -> analysis sequence
}

async function handleAnalysisInsightSequence(analysisEvent, insightEvent) {
  console.log(`Complete sequence: Analysis ${analysisEvent.id} completed and generated insight ${insightEvent.id}`);
  // Handle the complete analysis -> insight sequence
}
```

### Scaling Webhook Infrastructure

**Load Balancing**
```
Architecture Components:
1. Load Balancer
   • Distributes webhook requests across multiple servers
   • Performs health checks on webhook handlers
   • Provides SSL termination
   • Offers DDoS protection

2. Webhook Receivers
   • Lightweight servers that validate and queue events
   • Perform minimal processing
   • Focus on high availability and low latency
   • Scale horizontally based on load

3. Event Processors
   • Worker processes that handle queued events
   • Perform business logic and integrations
   • Scale independently from receivers
   • Can be specialized for different event types

4. Message Queue
   • Decouples receiving from processing
   • Provides buffering during traffic spikes
   • Enables retry mechanisms
   • Supports event routing and filtering

5. Monitoring System
   • Tracks webhook health and performance
   • Alerts on failures or anomalies
   • Provides visibility into processing
   • Helps diagnose issues
```

**High-Volume Processing**
```javascript
// Node.js example with worker threads
const express = require('express');
const { Worker } = require('worker_threads');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Redis = require('ioredis');

// Redis client for shared state
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Message queue client
const queue = require('./queue-service');

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  
  // Fork workers for webhook receiving
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker crashes
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
  
  // Start worker pool for event processing
  const workerPool = [];
  const numWorkers = process.env.NUM_WORKERS || 4;
  
  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker('./event-processor.js');
    worker.on('error', err => {
      console.error(`Worker error:`, err);
      // Restart worker
      const index = workerPool.indexOf(worker);
      if (index !== -1) {
        workerPool.splice(index, 1);
        const newWorker = new Worker('./event-processor.js');
        workerPool.push(newWorker);
      }
    });
    workerPool.push(worker);
  }
} else {
  // Worker process - webhook receiver
  const app = express();
  
  app.post('/webhooks/queryhive', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      // Verify webhook signature
      const signature = req.headers['x-queryhive-signature'];
      const timestamp = req.headers['x-queryhive-timestamp'];
      const payload = req.body.toString();
      
      if (!verifySignature(payload, signature, timestamp)) {
        return res.status(401).send('Invalid signature');
      }
      
      // Parse event
      const event = JSON.parse(payload);
      
      // Check for duplicate events (using Redis for distributed state)
      const isDuplicate = await redis.get(`event:${event.id}`);
      if (isDuplicate) {
        console.log(`Duplicate event ${event.id} received, acknowledging`);
        return res.status(200).send('Event already processed');
      }
      
      // Mark event as received with TTL
      await redis.set(`event:${event.id}`, 'received', 'EX', 86400); // 24 hour TTL
      
      // Acknowledge receipt immediately
      res.status(200).send('Webhook received');
      
      // Queue event for processing
      await queue.enqueue('webhook-events', {
        id: event.id,
        type: event.event,
        data: event.data,
        received_at: new Date().toISOString()
      });
      
      console.log(`Queued event ${event.id} for processing`);
    } catch (error) {
      // Still acknowledge receipt to prevent retries
      if (!res.headersSent) {
        res.status(200).send('Webhook received');
      }
      console.error('Error handling webhook:', error);
    }
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
  });
}

// event-processor.js (separate file)
const { parentPort } = require('worker_threads');
const queue = require('./queue-service');

async function processEvents() {
  while (true) {
    try {
      // Dequeue next event
      const event = await queue.dequeue('webhook-events');
      if (!event) {
        // No events, wait before checking again
        await sleep(1000);
        continue;
      }
      
      console.log(`Processing event ${event.id} of type ${event.type}`);
      
      // Process based on event type
      switch (event.type) {
        case 'dataset.processing.completed':
          await processDataset(event.data);
          break;
        case 'analysis.completed':
          await processAnalysis(event.data);
          break;
        case 'insight.created':
          await processInsight(event.data);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      // Mark as processed
      await queue.markProcessed('webhook-events', event.id);
    } catch (error) {
      console.error('Error processing event:', error);
      // Implement error handling, retries, dead-letter queue, etc.
    }
  }
}

// Start processing
processEvents().catch(error => {
  console.error('Fatal error in event processor:', error);
  process.exit(1);
});
```

## Integration Examples

### Data Pipeline Integration

**Airflow Integration**
```python
# Apache Airflow DAG for QueryHive webhook processing
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.utils.dates import days_ago
from flask import Flask, request, jsonify
import hmac
import hashlib
import json
import os
from datetime import datetime, timedelta

# Webhook verification
WEBHOOK_SECRET = os.environ.get('QUERYHIVE_WEBHOOK_SECRET')

# Flask app for webhook receiver
app = Flask(__name__)

@app.route('/webhooks/queryhive', methods=['POST'])
def webhook_handler():
    # Verify webhook signature
    signature = request.headers.get('X-QueryHive-Signature')
    timestamp = request.headers.get('X-QueryHive-Timestamp')
    payload = request.data.decode('utf-8')
    
    if not verify_signature(payload, signature, timestamp):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Parse event
    event = json.loads(payload)
    
    # Store event in Airflow XCom via file
    event_file = f"/tmp/queryhive_event_{event['id']}.json"
    with open(event_file, 'w') as f:
        json.dump(event, f)
    
    # Trigger appropriate DAG based on event type
    if event['event'] == 'dataset.processing.completed':
        # Trigger dataset processing DAG
        trigger_dag('queryhive_dataset_processing', {
            'event_file': event_file,
            'dataset_id': event['data']['id']
        })
    elif event['event'] == 'analysis.completed':
        # Trigger analysis processing DAG
        trigger_dag('queryhive_analysis_processing', {
            'event_file': event_file,
            'analysis_id': event['data']['id']
        })
    
    return jsonify({'status': 'success'}), 200

def verify_signature(payload, signature, timestamp):
    """Verify the webhook signature."""
    if not signature or not timestamp or not WEBHOOK_SECRET:
        return False
    
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        f"{timestamp}.{payload}".encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

def trigger_dag(dag_id, conf):
    """Trigger an Airflow DAG with configuration."""
    from airflow.api.client.local_client import Client
    
    client = Client(None, None)
    client.trigger_dag(dag_id=dag_id, conf=conf)

# Run Flask app for development
if __name__ == '__main__':
    app.run(port=3000)

# Airflow DAG for dataset processing
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'queryhive_dataset_processing',
    default_args=default_args,
    description='Process QueryHive dataset events',
    schedule_interval=None,
    start_date=days_ago(1),
    tags=['queryhive', 'webhook'],
) as dataset_dag:
    
    def process_dataset_event(**context):
        """Process dataset event from webhook."""
        # Get event file path from trigger
        event_file = context['dag_run'].conf.get('event_file')
        if not event_file:
            raise ValueError("No event file specified")
        
        # Load event data
        with open(event_file, 'r') as f:
            event = json.load(f)
        
        # Process dataset event
        dataset = event['data']
        print(f"Processing dataset {dataset['id']}: {dataset['name']}")
        print(f"Quality score: {dataset['processing']['quality_score']}")
        
        # Implement your dataset processing logic here
        # ...
        
        # Clean up event file
        os.remove(event_file)
        
        return dataset['id']
    
    process_task = PythonOperator(
        task_id='process_dataset',
        python_callable=process_dataset_event,
        provide_context=True,
    )
    
    # Add additional tasks as needed
    # ...

# Airflow DAG for analysis processing
with DAG(
    'queryhive_analysis_processing',
    default_args=default_args,
    description='Process QueryHive analysis events',
    schedule_interval=None,
    start_date=days_ago(1),
    tags=['queryhive', 'webhook'],
) as analysis_dag:
    
    def process_analysis_event(**context):
        """Process analysis event from webhook."""
        # Get event file path from trigger
        event_file = context['dag_run'].conf.get('event_file')
        if not event_file:
            raise ValueError("No event file specified")
        
        # Load event data
        with open(event_file, 'r') as f:
            event = json.load(f)
        
        # Process analysis event
        analysis = event['data']
        print(f"Processing analysis {analysis['id']}")
        print(f"Confidence score: {analysis['results']['confidence']}")
        
        # Implement your analysis processing logic here
        # ...
        
        # Clean up event file
        os.remove(event_file)
        
        return analysis['id']
    
    process_task = PythonOperator(
        task_id='process_analysis',
        python_callable=process_analysis_event,
        provide_context=True,
    )
    
    # Add additional tasks as needed
    # ...
```

**AWS Lambda Integration**
```javascript
// AWS Lambda function for webhook processing
const AWS = require('aws-sdk');
const crypto = require('crypto');

// Initialize AWS services
const sqs = new AWS.SQS();
const sns = new AWS.SNS();
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Webhook secret from environment
const WEBHOOK_SECRET = process.env.QUERYHIVE_WEBHOOK_SECRET;

// SQS queue URL for event processing
const EVENT_QUEUE_URL = process.env.EVENT_QUEUE_URL;

// SNS topic ARN for notifications
const NOTIFICATION_TOPIC_ARN = process.env.NOTIFICATION_TOPIC_ARN;

// S3 bucket for large event payloads
const EVENT_BUCKET = process.env.EVENT_BUCKET;

// DynamoDB table for event tracking
const EVENT_TABLE = process.env.EVENT_TABLE;

exports.handler = async (event) => {
  try {
    // API Gateway passes the body as a string
    const body = event.body;
    
    // Verify webhook signature
    const signature = event.headers['x-queryhive-signature'];
    const timestamp = event.headers['x-queryhive-timestamp'];
    
    if (!verifySignature(body, signature, timestamp)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }
    
    // Parse webhook payload
    const webhookEvent = JSON.parse(body);
    
    // Check for duplicate event
    const isDuplicate = await checkDuplicateEvent(webhookEvent.id);
    if (isDuplicate) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'Event already processed' })
      };
    }
    
    // Record event receipt
    await recordEventReceipt(webhookEvent);
    
    // Handle different event types
    switch (webhookEvent.event) {
      case 'dataset.processing.completed':
        await handleDatasetEvent(webhookEvent);
        break;
      case 'analysis.completed':
        await handleAnalysisEvent(webhookEvent);
        break;
      case 'insight.created':
        await handleInsightEvent(webhookEvent);
        break;
      default:
        // Queue unknown event types for general processing
        await queueEvent(webhookEvent);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success' })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Still return 200 to acknowledge receipt
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'error', message: 'Internal error, but event received' })
    };
  }
};

function verifySignature(payload, signature, timestamp) {
  if (!signature || !timestamp || !WEBHOOK_SECRET) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

async function checkDuplicateEvent(eventId) {
  const params = {
    TableName: EVENT_TABLE,
    Key: { eventId }
  };
  
  const result = await dynamoDB.get(params).promise();
  return !!result.Item;
}

async function recordEventReceipt(event) {
  const params = {
    TableName: EVENT_TABLE,
    Item: {
      eventId: event.id,
      eventType: event.event,
      receivedAt: new Date().toISOString(),
      status: 'received',
      processingStatus: 'pending'
    }
  };
  
  await dynamoDB.put(params).promise();
}

async function handleDatasetEvent(event) {
  const dataset = event.data;
  
  // For large events, store payload in S3
  if (JSON.stringify(event).length > 256000) { // SQS message size limit
    const s3Key = `events/${event.id}.json`;
    
    await s3.putObject({
      Bucket: EVENT_BUCKET,
      Key: s3Key,
      Body: JSON.stringify(event),
      ContentType: 'application/json'
    }).promise();
    
    // Queue message with S3 reference
    await sqs.sendMessage({
      QueueUrl: EVENT_QUEUE_URL,
      MessageBody: JSON.stringify({
        eventId: event.id,
        eventType: event.event,
        s3Reference: {
          bucket: EVENT_BUCKET,
          key: s3Key
        }
      })
    }).promise();
  } else {
    // Queue event directly
    await sqs.sendMessage({
      QueueUrl: EVENT_QUEUE_URL,
      MessageBody: JSON.stringify(event)
    }).promise();
  }
  
  // Send notification for high-quality datasets
  if (dataset.processing.quality_score >= 0.9) {
    await sns.publish({
      TopicArn: NOTIFICATION_TOPIC_ARN,
      Subject: `High-Quality Dataset Available: ${dataset.name}`,
      Message: JSON.stringify({
        event: 'high_quality_dataset',
        dataset: {
          id: dataset.id,
          name: dataset.name,
          quality_score: dataset.processing.quality_score,
          row_count: dataset.processing.row_count,
          column_count: dataset.processing.column_count
        }
      })
    }).promise();
  }
  
  // Update event status
  await dynamoDB.update({
    TableName: EVENT_TABLE,
    Key: { eventId: event.id },
    UpdateExpression: 'SET processingStatus = :status',
    ExpressionAttributeValues: {
      ':status': 'queued'
    }
  }).promise();
}

async function handleAnalysisEvent(event) {
  // Similar implementation to handleDatasetEvent
  // ...
}

async function handleInsightEvent(event) {
  // Similar implementation to handleDatasetEvent
  // ...
}

async function queueEvent(event) {
  // Queue generic event for processing
  await sqs.sendMessage({
    QueueUrl: EVENT_QUEUE_URL,
    MessageBody: JSON.stringify(event)
  }).promise();
  
  // Update event status
  await dynamoDB.update({
    TableName: EVENT_TABLE,
    Key: { eventId: event.id },
    UpdateExpression: 'SET processingStatus = :status',
    ExpressionAttributeValues: {
      ':status': 'queued'
    }
  }).promise();
}
```

### Notification Systems

**Slack Integration**
```javascript
// Node.js webhook handler with Slack notifications
const express = require('express');
const crypto = require('crypto');
const { WebClient } = require('@slack/web-api');
const app = express();

// Configuration
const WEBHOOK_SECRET = process.env.QUERYHIVE_WEBHOOK_SECRET;
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_NOTIFICATION_CHANNEL;

// Initialize Slack client
const slack = new WebClient(SLACK_TOKEN);

// Express middleware to capture raw body
app.use('/webhooks/queryhive', express.raw({ type: 'application/json' }), (req, res, next) => {
  req.rawBody = req.body.toString();
  req.body = JSON.parse(req.rawBody);
  next();
});

// Webhook verification middleware
function verifyWebhook(req, res, next) {
  const signature = req.headers['x-queryhive-signature'];
  const timestamp = req.headers['x-queryhive-timestamp'];
  const payload = req.rawBody;
  
  if (!signature || !timestamp) {
    return res.status(401).send('Missing signature or timestamp');
  }
  
  // Check if timestamp is recent (within 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(timestamp) > 300) {
    return res.status(401).send('Timestamp too old');
  }
  
  // Create expected signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  // Compare signatures
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    return res.status(401).send('Invalid signature');
  }
  
  next();
}

// Webhook endpoint
app.post('/webhooks/queryhive', verifyWebhook, async (req, res) => {
  try {
    const event = req.body;
    
    // Acknowledge receipt immediately
    res.status(200).send('Webhook received');
    
    // Process event asynchronously
    processEvent(event).catch(error => {
      console.error('Error processing event:', error);
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    if (!res.headersSent) {
      res.status(200).send('Webhook received');
    }
  }
});

async function processEvent(event) {
  console.log(`Processing event: ${event.event}`);
  
  // Send Slack notification based on event type
  switch (event.event) {
    case 'dataset.processing.completed':
      await notifyDatasetProcessed(event.data);
      break;
    case 'analysis.completed':
      await notifyAnalysisCompleted(event.data);
      break;
    case 'insight.created':
      await notifyInsightCreated(event.data);
      break;
    default:
      console.log(`No notification configured for event type: ${event.event}`);
  }
}

async function notifyDatasetProcessed(data) {
  const qualityEmoji = data.processing.quality_score >= 0.9 ? '🟢' :
                       data.processing.quality_score >= 0.7 ? '🟡' : '🔴';
  
  await slack.chat.postMessage({
    channel: SLACK_CHANNEL,
    text: `${qualityEmoji} Dataset processed: *${data.name}*`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${qualityEmoji} Dataset Processed: ${data.name}`,
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Quality Score:*\n${(data.processing.quality_score * 100).toFixed(1)}%`
          },
          {
            type: 'mrkdwn',
            text: `*Rows:*\n${data.processing.row_count.toLocaleString()}`
          },
          {
            type: 'mrkdwn',
            text: `*Columns:*\n${data.processing.column_count}`
          },
          {
            type: 'mrkdwn',
            text: `*Processing Time:*\n${(data.processing.duration_ms / 1000).toFixed(1)}s`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Processed at ${new Date(data.processing.completed_at).toLocaleString()} by ${data.created_by.name}`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Dataset',
              emoji: true
            },
            url: `https://app.queryhive.ai/datasets/${data.id}`,
            style: 'primary'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Run Analysis',
              emoji: true
            },
            url: `https://app.queryhive.ai/datasets/${data.id}/analyze`,
            style: 'primary'
          }
        ]
      }
    ]
  });
}

async function notifyAnalysisCompleted(data) {
  const confidenceEmoji = data.results.confidence >= 0.9 ? '🟢' :
                          data.results.confidence >= 0.7 ? '🟡' : '🔴';
  
  await slack.chat.postMessage({
    channel: SLACK_CHANNEL,
    text: `${confidenceEmoji} Analysis completed: *${data.query || data.type}*`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${confidenceEmoji} Analysis Completed`,
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Query:* ${data.query || data.type}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Confidence:*\n${(data.results.confidence * 100).toFixed(1)}%`
          },
          {
            type: 'mrkdwn',
            text: `*Processing Time:*\n${(data.duration_ms / 1000).toFixed(1)}s`
          },
          {
            type: 'mrkdwn',
            text: `*Dataset:*\n${data.dataset_id}`
          },
          {
            type: 'mrkdwn',
            text: `*Insights:*\n${data.results.insight_count || 'N/A'}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Summary:*\n${data.results.summary || 'No summary available'}`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Results',
              emoji: true
            },
            url: `https://app.queryhive.ai/analyses/${data.id}`,
            style: 'primary'
          }
        ]
      }
    ]
  });
}

async function notifyInsightCreated(data) {
  await slack.chat.postMessage({
    channel: SLACK_CHANNEL,
    text: `💡 New insight: *${data.title}*`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `💡 New Insight Generated`,
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.title}*`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: data.summary
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Type:* ${data.type} | *Confidence:* ${(data.confidence_score * 100).toFixed(1)}% | *Created by:* ${data.created_by.name}`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Insight',
              emoji: true
            },
            url: `https://app.queryhive.ai/insights/${data.id}`,
            style: 'primary'
          }
        ]
      }
    ]
  });
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook server running on port ${port}`);
});
```

**Email Notifications**
```javascript
// Node.js webhook handler with email notifications
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const app = express();

// Configuration
const WEBHOOK_SECRET = process.env.QUERYHIVE_WEBHOOK_SECRET;
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
};
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@example.com';

// Initialize email transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Express middleware and webhook verification
// ... (same as previous examples)

// Webhook endpoint
app.post('/webhooks/queryhive', verifyWebhook, async (req, res) => {
  try {
    const event = req.body;
    
    // Acknowledge receipt immediately
    res.status(200).send('Webhook received');
    
    // Process event asynchronously
    processEvent(event).catch(error => {
      console.error('Error processing event:', error);
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    if (!res.headersSent) {
      res.status(200).send('Webhook received');
    }
  }
});

async function processEvent(event) {
  console.log(`Processing event: ${event.event}`);
  
  // Send email notification based on event type
  switch (event.event) {
    case 'dataset.processing.completed':
      await sendDatasetEmail(event.data);
      break;
    case 'analysis.completed':
      await sendAnalysisEmail(event.data);
      break;
    case 'insight.created':
      await sendInsightEmail(event.data);
      break;
    default:
      console.log(`No notification configured for event type: ${event.event}`);
  }
}

async function sendDatasetEmail(data) {
  const qualityScore = (data.processing.quality_score * 100).toFixed(1);
  const qualityClass = data.processing.quality_score >= 0.9 ? 'high' :
                       data.processing.quality_score >= 0.7 ? 'medium' : 'low';
  
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `Dataset Processed: ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4285F4;">Dataset Processing Completed</h2>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #4285F4; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${data.name}</h3>
          <p>${data.description || 'No description provided'}</p>
        </div>
        
        <h3>Processing Results</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 50%;"><strong>Quality Score</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd; width: 50%;">
              <span style="color: ${
                qualityClass === 'high' ? '#34A853' :
                qualityClass === 'medium' ? '#FBBC05' : '#EA4335'
              };">${qualityScore}%</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Rows</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.processing.row_count.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Columns</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.processing.column_count}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Processing Time</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${(data.processing.duration_ms / 1000).toFixed(1)} seconds</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Issues Detected</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.processing.issues_detected || 0}</td>
          </tr>
        </table>
        
        <div style="margin: 30px 0;">
          <a href="https://app.queryhive.ai/datasets/${data.id}" style="background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Dataset</a>
          <a href="https://app.queryhive.ai/datasets/${data.id}/analyze" style="background-color: #34A853; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-left: 10px;">Run Analysis</a>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          Processed at ${new Date(data.processing.completed_at).toLocaleString()} by ${data.created_by.name}
        </p>
      </div>
    `
  });
}

async function sendAnalysisEmail(data) {
  // Similar implementation to sendDatasetEmail
  // ...
}

async function sendInsightEmail(data) {
  // Similar implementation to sendDatasetEmail
  // ...
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook server running on port ${port}`);
});
```

## Best Practices

### Security Best Practices

**Secure Webhook Handling**
```
Security Checklist:
1. Use HTTPS for all webhook endpoints
2. Implement signature verification
3. Validate webhook timestamp
4. Use strong webhook secrets
5. Rotate secrets periodically
6. Implement IP allowlisting
7. Set up rate limiting
8. Monitor for suspicious activity
9. Implement proper error handling
10. Use least privilege principles
```

**Preventing Common Attacks**
```
Mitigation Strategies:

1. Replay Attacks
   • Validate timestamp recency
   • Implement idempotency keys
   • Track processed event IDs

2. Man-in-the-Middle Attacks
   • Enforce HTTPS with strong TLS
   • Validate certificates
   • Use HTTP Strict Transport Security

3. Denial of Service
   • Implement rate limiting
   • Set request timeouts
   • Use CDN protection
   • Separate webhook receiving from processing

4. Server-Side Request Forgery
   • Validate webhook source
   • Implement IP allowlisting
   • Restrict internal network access
```

### Operational Best Practices

**Monitoring and Alerting**
```
Monitoring Metrics:
• Webhook delivery success rate
• Processing time per event type
• Error rates and types
• Queue depth and processing backlog
• Resource utilization

Alert Conditions:
• Success rate drops below 95%
• Processing time exceeds thresholds
• Error rate exceeds 5%
• Queue depth grows abnormally
• Resource utilization spikes

Monitoring Implementation:
1. Log all webhook receipts and processing
2. Track timing metrics for each stage
3. Implement health check endpoints
4. Set up dashboards for visibility
5. Configure alerts for critical conditions
```

**Deployment Strategies**
```
Deployment Best Practices:
1. Use separate environments
   • Development for testing
   • Staging for verification
   • Production for live events

2. Implement progressive rollout
   • Start with non-critical event types
   • Gradually add more critical events
   • Monitor closely during expansion

3. Maintain backward compatibility
   • Support multiple webhook versions
   • Implement graceful degradation
   • Document breaking changes

4. Implement feature flags
   • Control webhook behavior
   • Enable/disable specific event types
   • A/B test processing strategies
```

---

**Estimated Reading Time**: 35 minutes  
**Difficulty**: Advanced  
**Prerequisites**: API development experience, event-driven architecture concepts  
**Last Updated**: January 2025