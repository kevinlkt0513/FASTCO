import os
import random
import string
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env.dev file
load_dotenv(dotenv_path='.env.dev')

def random_string(length=8):
    """Generate a random string of letters with given length."""
    return ''.join(random.choices(string.ascii_letters, k=length))

def generate_user_data(num_docs=10000):
    """Generate a list of user documents with mock data."""
    countries = ['SG', 'US', 'IN']
    users = []
    for _ in range(num_docs):
        country = random.choice(countries)
        name = random_string(6)
        email = f"{name.lower()}@example.com"
        mobile_no = ''.join(random.choices(string.digits, k=8))
        country_code = "+65" if country == "SG" else "+1"
        users.append({
            "country": country,
            "name": name,
            "email": email,
            "mobile_no": mobile_no,
            "country_code": country_code,
            "showAllDocuments": "true"
        })
    return users

def main():
    # Read config from environment variables
    mongo_uri = os.getenv('MONGODB_URI')
    db_name = os.getenv('DB_NAME')
    collection_name = os.getenv('COLLECTION_NAME')
    
    if not mongo_uri or not db_name or not collection_name:
        print("Please make sure MONGODB_URI, DB_NAME and COLLECTION_NAME are set correctly in the .env file.")
        return

    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    
    # Select the database and collection from environment variables
    db = client[db_name]
    collection = db[collection_name]

    # Drop existing collection to start fresh
    print(f"Dropping existing collection '{collection_name}' in database '{db_name}' ...")
    collection.drop()

    # Generate mock data
    print("Generating mock user data...")
    data_batch = generate_user_data(500000)

    # Insert data
    print(f"Inserting data into collection '{collection_name}' ...")
    collection.insert_many(data_batch)

    print(f"Data insertion complete. Total documents inserted: {len(data_batch)}")

if __name__ == '__main__':
    main()
