# Data Science Notebooks

Agents should write notebooks in the `notebooks` folder of this project.

## Obtaining Sales Data

The sales data can be obtained from the following public URL:
https://pocs.nyc3.cdn.digitaloceanspaces.com/sales_data_sample.csv

You can download this data using Python with the following code:

```python
import pandas as pd

url = "https://pocs.nyc3.cdn.digitaloceanspaces.com/sales_data_sample.csv"
sales_data = pd.read_csv(url)
```

## Data Dictionary

The sales data contains the following columns:

- **ORDERNUMBER**: Unique identifier for each order
- **QUANTITYORDERED**: Number of items ordered
- **PRICEEACH**: Price per item
- **ORDERLINENUMBER**: Line number within the order
- **SALES**: Total sales amount for the order line
- **ORDERDATE**: Date when the order was placed
- **STATUS**: Status of the order (Shipped, Cancelled, Resolved, etc.)
- **QTR_ID**: Quarter of the year (1-4)
- **MONTH_ID**: Month of the year (1-12)
- **YEAR_ID**: Year when the order was placed
- **PRODUCTLINE**: Category of product (Motorcycles, Ships, etc.)
- **MSRP**: Manufacturer's Suggested Retail Price
- **PRODUCTCODE**: Unique identifier for each product
- **CUSTOMERNAME**: Name of the customer
- **PHONE**: Customer's phone number
- **ADDRESSLINE1**: First line of customer's address
- **ADDRESSLINE2**: Second line of customer's address (if applicable)
- **CITY**: Customer's city
- **STATE**: Customer's state/province
- **POSTALCODE**: Customer's postal code
- **COUNTRY**: Customer's country
- **TERRITORY**: Sales territory (NA, EMEA, APAC)
- **CONTACTLASTNAME**: Customer contact's last name
- **CONTACTFIRSTNAME**: Customer contact's first name
- **DEALSIZE**: Size of the deal (Small, Medium, Large)
