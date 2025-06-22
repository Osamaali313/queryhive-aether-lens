# Natural Language Queries

Master the art of asking questions about your data in plain English. This comprehensive guide covers everything from basic queries to advanced analytical requests.

## Introduction to Natural Language Processing

QueryHive AI uses advanced natural language processing (NLP) to understand your questions and translate them into sophisticated data analysis operations. You don't need to know SQL, Python, or any programming language – just ask questions as you would to a human analyst.

### How It Works
1. **Intent Recognition**: AI identifies what type of analysis you want
2. **Entity Extraction**: Identifies relevant columns, values, and parameters
3. **Query Translation**: Converts your question into analytical operations
4. **Context Awareness**: Remembers previous questions and builds on them
5. **Response Generation**: Provides insights in natural language with visualizations

## Basic Query Patterns

### Descriptive Statistics
Ask about basic properties of your data:

```
"What's the average sales amount?"
"How many customers do we have?"
"What's the total revenue for last month?"
"Show me the minimum and maximum prices"
```

**AI Response Example:**
```
📊 Sales Statistics Summary

Average Sales Amount: $1,247.83
• Median: $892.50
• Standard Deviation: $634.21
• Range: $45.00 - $15,847.99

Total Customers: 2,847 unique customers
• New customers this month: 234 (8.2% growth)
• Returning customers: 2,613 (91.8%)

Revenue Analysis:
• Last month total: $3,547,892.45
• Previous month: $3,234,567.12
• Growth: +9.7% month-over-month
```

### Filtering and Segmentation
Filter data based on specific criteria:

```
"Show me sales from the North region"
"What are the electronics sales for Q4?"
"Find customers who spent more than $1000"
"Display orders from premium customers only"
```

### Ranking and Top/Bottom Lists
Identify best and worst performers:

```
"Who are our top 10 customers by revenue?"
"What are the 5 worst-selling products?"
"Rank regions by total sales"
"Show me the most profitable product categories"
```

## Intermediate Query Patterns

### Trend Analysis
Understand how metrics change over time:

```
"How have sales changed over the last 6 months?"
"Show me the trend in customer acquisition"
"What's the growth rate of our premium segment?"
"Compare this quarter's performance to last quarter"
```

**AI Response Example:**
```
📈 Sales Trend Analysis (Last 6 Months)

Overall Trend: Positive growth (+23.4%)
• January: $2.1M (baseline)
• February: $2.3M (+9.5%)
• March: $2.7M (+17.4%)
• April: $2.4M (-11.1%)
• May: $2.8M (+16.7%)
• June: $2.6M (-7.1%)

Key Insights:
• Strong growth momentum with seasonal dips
• April decline likely due to market conditions
• Recovery pattern shows resilience
• Projected July: $2.9M (+11.5%)
```

### Comparative Analysis
Compare different segments, periods, or categories:

```
"Compare sales between North and South regions"
"How do premium vs standard products perform?"
"What's the difference in customer behavior by age group?"
"Compare this year's Q1 to last year's Q1"
```

### Correlation and Relationships
Discover connections between variables:

```
"Is there a relationship between price and sales volume?"
"How does customer satisfaction correlate with repeat purchases?"
"What factors influence customer lifetime value?"
"Show me the correlation between marketing spend and revenue"
```

## Advanced Query Patterns

### Predictive Questions
Ask about future trends and forecasts:

```
"What will sales look like next quarter?"
"Predict customer churn for the next 6 months"
"Forecast inventory needs for the holiday season"
"What's the expected lifetime value of new customers?"
```

**AI Response Example:**
```
🔮 Sales Forecast - Next Quarter (Q2 2024)

Predicted Revenue: $8.7M ± $0.6M
• Confidence Level: 87%
• Growth Rate: +12.3% vs Q1
• Seasonal Adjustment: +5.2%

Monthly Breakdown:
• April: $2.8M (Conservative estimate)
• May: $3.1M (Peak season begins)
• June: $2.8M (Seasonal normalization)

Key Factors:
• Historical growth patterns
• Seasonal trends
• Market conditions
• Product launch impact (+$0.4M expected)

Recommendation: Increase inventory by 15% to meet demand
```

### Anomaly Detection
Identify unusual patterns or outliers:

```
"Are there any unusual patterns in the sales data?"
"Find anomalies in customer behavior"
"What transactions look suspicious?"
"Identify outliers in product performance"
```

### Segmentation and Clustering
Discover natural groupings in your data:

```
"How can we segment our customers?"
"What are the different types of buyers?"
"Group products by performance characteristics"
"Find natural clusters in the data"
```

### Root Cause Analysis
Understand why certain patterns exist:

```
"Why did sales drop in March?"
"What caused the spike in customer complaints?"
"Why is the North region outperforming others?"
"What factors led to increased churn?"
```

## Query Optimization Techniques

### Be Specific with Context
Instead of: "Show me sales"
Better: "Show me monthly sales revenue for electronics products in 2024"

### Use Temporal References
- "Last month" vs "Previous 30 days"
- "Q4 2023" vs "October to December 2023"
- "Year-over-year" vs "Compared to same period last year"

### Specify Metrics Clearly
- "Revenue" vs "Number of sales" vs "Profit"
- "Unique customers" vs "Total orders"
- "Average order value" vs "Total order value"

### Include Relevant Dimensions
- "By region" / "By product category" / "By customer segment"
- "Broken down by" / "Segmented by" / "Grouped by"

## Advanced Natural Language Features

### Multi-Turn Conversations
Build on previous questions for deeper analysis:

```
User: "What are our top 5 products by revenue?"
AI: [Shows top 5 products with revenue figures]

User: "Now show me the profit margins for these products"
AI: [Analyzes profit margins for the previously mentioned top 5 products]

User: "Which of these has the best growth trend?"
AI: [Compares growth trends for the top 5 products]
```

### Conditional Logic
Use if-then statements and complex conditions:

```
"If a customer hasn't purchased in 90 days, classify them as at-risk"
"Show me products where revenue is high but profit margin is low"
"Find customers who bought premium products but haven't returned"
```

### Mathematical Operations
Perform calculations and create derived metrics:

```
"Calculate the customer acquisition cost by dividing marketing spend by new customers"
"What's the ratio of returning customers to new customers?"
"Compute the compound annual growth rate for revenue"
```

### Statistical Analysis
Request specific statistical tests and measures:

```
"Is the difference in sales between regions statistically significant?"
"Calculate the confidence interval for average order value"
"Perform a chi-square test on customer preferences by region"
```

## Domain-Specific Query Examples

### Sales & Marketing
```
"What's our customer acquisition cost by channel?"
"Which marketing campaigns have the highest ROI?"
"Show me the sales funnel conversion rates"
"What's the lifetime value of customers from different sources?"
```

### Finance & Accounting
```
"Calculate our gross margin by product line"
"What's the accounts receivable aging analysis?"
"Show me cash flow trends for the last 12 months"
"Analyze expense categories as a percentage of revenue"
```

### Operations & Supply Chain
```
"What's our inventory turnover rate by category?"
"Show me supplier performance metrics"
"Analyze delivery times by shipping method"
"What's the capacity utilization across facilities?"
```

### Human Resources
```
"What's the employee turnover rate by department?"
"Show me hiring trends over the last year"
"Analyze performance ratings by team"
"What's the average time to fill open positions?"
```

## Troubleshooting Common Issues

### Ambiguous Queries
**Problem**: "Show me the best products"
**Issue**: "Best" could mean highest revenue, profit, volume, or rating
**Solution**: "Show me products with the highest profit margins"

### Missing Context
**Problem**: "What's the trend?"
**Issue**: Trend of what metric, over what time period?
**Solution**: "What's the revenue trend over the last 6 months?"

### Incorrect Column References
**Problem**: "Show me sales by salesperson"
**Issue**: Column might be named "sales_rep" or "representative"
**Solution**: AI will suggest correct column names or ask for clarification

### Complex Multi-Part Questions
**Problem**: "Show me top customers and their favorite products and when they last bought and how much they spent"
**Solution**: Break into multiple questions:
1. "Who are our top 10 customers by total spend?"
2. "What are the favorite products for these customers?"
3. "When did each of these customers last make a purchase?"

## Best Practices

### Start Simple, Then Elaborate
1. Begin with basic questions to understand your data
2. Build complexity gradually
3. Use follow-up questions to dive deeper
4. Combine insights from multiple queries

### Use Business Language
- Speak in terms familiar to your industry
- Use your organization's terminology
- Reference business processes and metrics
- Include relevant business context

### Validate Results
- Cross-check AI responses with known facts
- Ask for explanations of methodology
- Request confidence levels for predictions
- Verify statistical significance

### Iterate and Refine
- Rephrase questions if results aren't what you expected
- Ask for clarification when responses are unclear
- Build on previous answers for deeper insights
- Save successful query patterns for reuse

## Advanced Tips and Tricks

### Use Synonyms and Variations
The AI understands multiple ways to express the same concept:
- "Revenue" = "Sales" = "Income" = "Earnings"
- "Customers" = "Clients" = "Buyers" = "Users"
- "Products" = "Items" = "SKUs" = "Merchandise"

### Leverage Business Intelligence Terms
- "KPIs" (Key Performance Indicators)
- "Cohort analysis"
- "Funnel analysis"
- "Retention rates"
- "Churn analysis"

### Request Specific Visualizations
```
"Show me a scatter plot of price vs sales volume"
"Create a heat map of sales by region and month"
"Display a funnel chart for our sales process"
"Generate a time series chart for revenue trends"
```

### Ask for Recommendations
```
"What actions should we take to improve customer retention?"
"Recommend strategies to increase average order value"
"Suggest ways to optimize our product mix"
"What should we focus on to grow revenue?"
```

---

**Estimated Reading Time**: 18 minutes  
**Difficulty**: Beginner to Advanced  
**Prerequisites**: Basic understanding of your data structure  
**Last Updated**: January 2025