# Data Science Notebooks

Agents should write notebooks in the `notebooks` folder of this project.

## Obtaining Sales Data

The sales data can be obtained from the following public URL:
https://pocs.nyc3.cdn.digitaloceanspaces.com/sales_data_sample.csv

You can download this data using Python with the following code:

Super important to be robust regarding encoding. 

```python
# Load the sales data by first downloading the raw bytes and then decoding properly
import requests
import io

url = "https://pocs.nyc3.cdn.digitaloceanspaces.com/sales_data_sample.csv"

# Download the raw bytes
response = requests.get(url)
raw_data = response.content

# First, try to detect encoding - most likely latin1 or cp1252 based on the error
try:
    decoded_content = raw_data.decode('latin1')
    encoding_used = 'latin1'
except UnicodeDecodeError:
    try:
        decoded_content = raw_data.decode('cp1252')
        encoding_used = 'cp1252'
    except UnicodeDecodeError:
        # Fallback to a very permissive encoding that rarely fails
        decoded_content = raw_data.decode('latin1', errors='replace')
        encoding_used = 'latin1 with replacement'

print(f"Successfully decoded file using {encoding_used} encoding")

# Load the CSV from the properly decoded string
sales_data = pd.read_csv(io.StringIO(decoded_content))

# Display the first few rows
sales_data.head()
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


# Important Notes

## Format

When creating Jupyter notebook JSON structures, ensure all code cells include an empty 'outputs' array, even if there are no outputs yet. The basic structure for a code cell must include:

{
  "cell_type": "code",
  "execution_count": null,
  "metadata": {},
  "source": ["your code here"],
  "outputs": []
}

The 'outputs' field is required for all code cells according to the Jupyter notebook specification, even if it's empty. Omitting this field will cause 'Notebook JSON is invalid: outputs is a required property' errors when trying to open or run the notebook.

## Dependencies

The notebook runs on a separated server, so for each dependency needed simply add in an initial cell the 

```!pip install <dependency>```

This will ensure that the dependency is installed on the server and can be used in the notebook.

For example, if seaborn is needed, the following cell should be added:

```!pip install seaborn```

# Implementation examples 

If the user instruction is related to an example, read the example. 

In _examples/rfm_analysis_notebook.ipynb there is an example of how to implement the RFM analysis.


