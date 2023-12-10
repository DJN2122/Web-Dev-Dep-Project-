import pandas as pd
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# Define the number of entries
num_entries = 100000

# Initialize the list for each column
data = {
    'ID': [i for i in range(1, num_entries + 1)],
    'Name': [fake.name() for _ in range(num_entries)],
    'Age': [random.randint(18, 80) for _ in range(num_entries)],
    'Race': [random.choice(['Caucasian', 'African-American', 'Hispanic', 'Asian', 'Other']) for _ in range(num_entries)],
    'Crime': [fake.sentence(nb_words=5) for _ in range(num_entries)],
    'Crime Date': [fake.date_between(start_date='-30y', end_date='today').isoformat() for _ in range(num_entries)],
    'Conviction Date': [fake.date_between(start_date='-30y', end_date='today').isoformat() for _ in range(num_entries)],
    'Release Date': [fake.date_between(start_date='today', end_date='+30y').isoformat() for _ in range(num_entries)],
    'Status': [random.choice(['Incarcerated', 'Released', 'At Large']) for _ in range(num_entries)],
    'Last Known Location': [fake.city() for _ in range(num_entries)],
    'Risk Level': [random.choice(['Low', 'Medium', 'High']) for _ in range(num_entries)],
    'Wanted': [random.choice(['Yes', 'No']) for _ in range(num_entries)]
}

# Create a DataFrame with the data
criminals_df = pd.DataFrame(data)

# Save the DataFrame to a CSV file
criminals_csv_path = 'criminals.csv'
criminals_df.to_csv(criminals_csv_path, index=False)