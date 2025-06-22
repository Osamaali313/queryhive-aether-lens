# Data Upload Best Practices

Master the art of preparing and uploading data to QueryHive AI for optimal analysis results. This comprehensive guide covers everything from file preparation to troubleshooting common issues.

## File Format Requirements

### Supported Formats

**Primary Format: CSV (Comma-Separated Values)**
- **Encoding**: UTF-8 (recommended), UTF-16, ASCII
- **Delimiters**: Comma (,), semicolon (;), tab, pipe (|)
- **File Extension**: .csv
- **Maximum Size**: 50MB per file
- **Maximum Rows**: 1 million rows per file

**Future Support** (Coming Soon):
- Excel files (.xlsx, .xls)
- JSON files (.json)
- Parquet files (.parquet)
- Database connections (SQL, NoSQL)

### CSV Structure Requirements

**Header Row**
```csv
✅ GOOD: Clear, descriptive headers
customer_id,first_name,last_name,email,purchase_date,amount

❌ BAD: Missing or unclear headers
C1,C2,C3,C4,C5,C6
```

**Data Consistency**
```csv
✅ GOOD: Consistent data types
customer_id,purchase_date,amount
CUST001,2024-01-15,299.99
CUST002,2024-01-16,156.50

❌ BAD: Mixed data types
customer_id,purchase_date,amount
CUST001,2024-01-15,299.99
CUST002,Jan 16 2024,One hundred fifty-six dollars
```

## Data Preparation Guidelines

### Column Naming Best Practices

**Use Descriptive Names**
```csv
✅ GOOD: Self-explanatory column names
customer_id, first_name, last_name, email_address, 
phone_number, registration_date, total_purchases

❌ BAD: Cryptic abbreviations
cid, fn, ln, em, ph, reg_dt, tot_purch
```

**Naming Conventions**
- Use lowercase letters
- Replace spaces with underscores
- Avoid special characters (!@#$%^&*)
- Keep names under 50 characters
- Use consistent terminology across files

**Reserved Words to Avoid**
Avoid SQL and programming reserved words:
- `select`, `from`, `where`, `order`, `group`
- `date`, `time`, `user`, `table`, `index`
- `class`, `function`, `return`, `import`

### Data Type Optimization

**Numeric Data**
```csv
✅ GOOD: Clean numeric values
price,quantity,discount_percent
299.99,2,10.5
156.50,1,0

❌ BAD: Text in numeric columns
price,quantity,discount_percent
$299.99,2 items,10.5%
$156.50,1 item,No discount
```

**Date and Time Data**
```csv
✅ GOOD: Consistent date format (ISO 8601)
order_date,delivery_date,created_at
2024-01-15,2024-01-18,2024-01-15T10:30:00Z
2024-01-16,2024-01-19,2024-01-16T14:22:00Z

❌ BAD: Inconsistent date formats
order_date,delivery_date,created_at
01/15/2024,Jan 18 2024,15-01-2024 10:30 AM
1/16/24,2024-01-19,16/1/24 2:22 PM
```

**Text Data**
```csv
✅ GOOD: Clean text data
product_name,description,category
"Laptop Pro 15""","High-performance laptop","Electronics"
"Office Chair","Ergonomic desk chair","Furniture"

❌ BAD: Unescaped special characters
product_name,description,category
Laptop Pro 15",High-performance laptop,Electronics
Office Chair,"Ergonomic desk chair,Furniture
```

**Boolean Data**
```csv
✅ GOOD: Consistent boolean values
is_premium,is_active,email_verified
true,true,false
false,true,true

✅ ALSO GOOD: Numeric boolean
is_premium,is_active,email_verified
1,1,0
0,1,1

❌ BAD: Inconsistent boolean representation
is_premium,is_active,email_verified
Yes,Active,Not verified
No,Inactive,Verified
```

## Data Quality Guidelines

### Completeness

**Handle Missing Values**
```csv
✅ GOOD: Explicit null representation
customer_id,email,phone,address
CUST001,john@email.com,,123 Main St
CUST002,jane@email.com,555-0123,

❌ BAD: Inconsistent missing value representation
customer_id,email,phone,address
CUST001,john@email.com,N/A,123 Main St
CUST002,jane@email.com,555-0123,NULL
CUST003,,Unknown,Not provided
```

**Minimum Data Requirements**
- At least 50 rows for basic analysis
- At least 200 rows for machine learning
- At least 1,000 rows for advanced analytics
- Complete data in key columns (>80% filled)

### Consistency

**Standardize Categories**
```csv
✅ GOOD: Consistent category values
product_category,customer_type,region
Electronics,Premium,North
Electronics,Standard,South
Furniture,Premium,North

❌ BAD: Inconsistent category values
product_category,customer_type,region
Electronics,Premium,North
Electronic,premium,NORTH
Furniture,Std,N
```

**Normalize Text Data**
```csv
✅ GOOD: Consistent text formatting
company_name,city,state
Apple Inc,Cupertino,CA
Microsoft Corporation,Redmond,WA

❌ BAD: Inconsistent text formatting
company_name,city,state
apple inc.,CUPERTINO,California
Microsoft Corp,redmond,wa
```

### Accuracy

**Validate Data Ranges**
```csv
✅ GOOD: Realistic data values
age,salary,years_experience
25,45000,3
35,75000,12
45,95000,20

❌ BAD: Unrealistic data values
age,salary,years_experience
250,4500000,3
-5,75000,50
45,95000,-2
```

**Check for Duplicates**
```csv
✅ GOOD: Unique records
customer_id,email,registration_date
CUST001,john@email.com,2024-01-15
CUST002,jane@email.com,2024-01-16

❌ BAD: Duplicate records
customer_id,email,registration_date
CUST001,john@email.com,2024-01-15
CUST001,john@email.com,2024-01-15
```

## Upload Process Optimization

### File Size Management

**Large File Strategies**
If your file exceeds 50MB:

1. **Split by Time Period**
```
sales_2024_q1.csv (Jan-Mar)
sales_2024_q2.csv (Apr-Jun)
sales_2024_q3.csv (Jul-Sep)
sales_2024_q4.csv (Oct-Dec)
```

2. **Split by Category**
```
sales_electronics.csv
sales_furniture.csv
sales_clothing.csv
```

3. **Sample for Testing**
```
sales_sample_1000.csv (first 1000 rows)
sales_full.csv (complete dataset)
```

**Compression Options**
- ZIP files are automatically extracted
- Reduces upload time by 60-80%
- Maintains data integrity
- Supports multiple files in one archive

### Upload Performance Tips

**Optimal Upload Conditions**
- Stable internet connection (minimum 1 Mbps upload)
- Close unnecessary browser tabs
- Upload during off-peak hours
- Use wired connection when possible

**Batch Upload Strategy**
1. Start with a small sample file (1,000 rows)
2. Verify data quality and structure
3. Upload remaining data in chunks
4. Monitor upload progress and quality scores

## Data Validation and Quality Scoring

### Automatic Validation

QueryHive AI automatically checks:

**Structure Validation**
- Header row presence and quality
- Column count consistency
- Data type detection accuracy
- Encoding compatibility

**Content Validation**
- Missing value patterns
- Data type consistency
- Value range validation
- Duplicate detection

**Quality Metrics**
- **Completeness**: Percentage of non-null values
- **Consistency**: Data type and format uniformity
- **Accuracy**: Realistic value ranges
- **Uniqueness**: Duplicate record detection

### Quality Score Interpretation

**Excellent (90-100%)**
- Ready for immediate analysis
- All ML models available
- High confidence in results
- Minimal data issues

**Good (80-89%)**
- Suitable for most analyses
- Minor data cleaning recommended
- Most ML models available
- Good confidence in results

**Fair (70-79%)**
- Basic analysis possible
- Data cleaning required for ML
- Limited model availability
- Moderate confidence in results

**Poor (<70%)**
- Significant data issues detected
- Extensive cleaning required
- Limited analysis capabilities
- Low confidence in results

### Common Quality Issues and Solutions

**Issue: Low Completeness Score**
```
Problem: Many missing values in key columns
Solution: 
- Fill missing values with appropriate defaults
- Remove rows with excessive missing data
- Collect additional data for incomplete records
```

**Issue: Inconsistent Data Types**
```
Problem: Mixed text and numbers in numeric columns
Solution:
- Standardize numeric formatting
- Remove currency symbols and commas
- Convert text representations to numbers
```

**Issue: Date Format Problems**
```
Problem: Multiple date formats in same column
Solution:
- Standardize to ISO 8601 format (YYYY-MM-DD)
- Use consistent timezone representation
- Validate date ranges for reasonableness
```

## Advanced Data Preparation

### Data Enrichment

**Calculated Fields**
Add derived columns before upload:
```csv
order_date,quantity,unit_price,total_amount
2024-01-15,2,299.99,599.98
2024-01-16,1,156.50,156.50
```

**Categorical Encoding**
Prepare categorical data for analysis:
```csv
customer_type,customer_type_code,priority_level
Premium,1,High
Standard,2,Medium
Basic,3,Low
```

**Temporal Features**
Extract time-based features:
```csv
transaction_date,year,month,quarter,day_of_week
2024-01-15,2024,1,1,Monday
2024-01-16,2024,1,1,Tuesday
```

### Data Normalization

**Numeric Scaling**
For ML analysis, consider pre-scaling:
```csv
revenue,revenue_scaled,employees,employees_scaled
1000000,1.0,50,0.5
500000,0.5,25,0.25
2000000,2.0,100,1.0
```

**Text Standardization**
Standardize text fields:
```csv
company_name,industry,location
Apple Inc.,Technology,United States
Microsoft Corporation,Technology,United States
Amazon.com Inc.,E-commerce,United States
```

## Troubleshooting Common Issues

### Upload Failures

**File Too Large**
```
Error: "File size exceeds 50MB limit"
Solution:
1. Split file into smaller chunks
2. Compress file using ZIP
3. Remove unnecessary columns
4. Sample data for initial testing
```

**Encoding Issues**
```
Error: "Character encoding not supported"
Solution:
1. Save file as UTF-8 encoding
2. Remove special characters
3. Use standard ASCII characters
4. Check for hidden characters
```

**Format Problems**
```
Error: "Invalid CSV format"
Solution:
1. Ensure proper comma separation
2. Escape quotes in text fields
3. Remove extra commas or delimiters
4. Validate file structure
```

### Data Quality Issues

**Type Detection Errors**
```
Problem: Numbers detected as text
Solution:
1. Remove currency symbols ($, €, £)
2. Remove thousands separators (,)
3. Use decimal points (.) not commas
4. Remove leading/trailing spaces
```

**Date Parsing Failures**
```
Problem: Dates not recognized
Solution:
1. Use ISO 8601 format (YYYY-MM-DD)
2. Ensure consistent format throughout
3. Validate date ranges
4. Remove time zones if not needed
```

**Missing Value Issues**
```
Problem: High percentage of missing values
Solution:
1. Use consistent null representation
2. Consider data collection improvements
3. Evaluate if column is necessary
4. Use imputation techniques if appropriate
```

## Best Practices Checklist

### Pre-Upload Checklist

**File Preparation**
- [ ] File is in CSV format
- [ ] File size under 50MB
- [ ] UTF-8 encoding used
- [ ] Header row present and descriptive

**Data Quality**
- [ ] Column names follow conventions
- [ ] Data types are consistent
- [ ] Missing values handled appropriately
- [ ] Duplicates removed or identified

**Content Validation**
- [ ] Numeric columns contain only numbers
- [ ] Dates in consistent format
- [ ] Categories standardized
- [ ] Text fields properly escaped

### Post-Upload Validation

**Quality Review**
- [ ] Quality score above 80%
- [ ] All columns detected correctly
- [ ] Data types assigned properly
- [ ] Sample data looks correct

**Analysis Readiness**
- [ ] Sufficient data volume
- [ ] Key columns complete
- [ ] Relationships identifiable
- [ ] Business context preserved

## Getting Help

### Self-Service Resources
- **Data Quality Report**: Review detailed quality metrics
- **Column Analysis**: Examine each column's characteristics
- **Sample Data**: Preview how data was interpreted
- **Validation Errors**: See specific issues detected

### Support Options
- **Documentation**: Comprehensive guides and examples
- **Community Forum**: User discussions and solutions
- **Email Support**: Direct assistance for complex issues
- **Live Chat**: Real-time help during business hours

### Advanced Support
- **Data Consultation**: Expert review of data preparation
- **Custom Integration**: API-based data connections
- **Training Sessions**: Team training on best practices
- **Enterprise Support**: Dedicated support for large deployments

---

**Estimated Reading Time**: 22 minutes  
**Difficulty**: Beginner to Intermediate  
**Prerequisites**: Basic understanding of CSV files  
**Last Updated**: January 2025