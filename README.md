## MongoDB Book Operations
* This repository contains Node.js scripts for interacting with a MongoDB database, specifically for managing a collection of books.

## Project Structure
- insert_books.js: Script to connect to MongoDB and insert sample book documents into the plp_bookstore database and books collection. It clears the collection before inserting new data to ensure a fresh start.

- queries.js: Script containing various MongoDB queries, advanced queries with projection, sorting, and pagination, aggregation pipelines, and demonstrations of indexing with explain().

## README.md: This file, providing setup and usage instructions.

## Prerequisites
- Before running these scripts, ensure you have the following installed:

- Node.js: Download and install Node.js

- MongoDB: Download and install MongoDB Community Server and ensure it's running (typically on localhost:27017).

## Setup
- Clone or Download: Get these files into a local directory on your machine.

- Navigate to Project Directory: Open your terminal or command prompt and navigate to the directory where you saved the files.

- cd /path/to/your/mongodb-books-project

## Initialize Node.js Project (if not already done):

- npm init -y

## Install MongoDB Driver: Install the official MongoDB Node.js driver.

- npm install mongodb

## Usage
- Follow these steps to run the scripts:

- Populate the Database: First, run the insert_books.js script to populate your MongoDB collection with sample data. This script will clear any existing documents in the books collection of the plp_bookstore database before inserting the new ones.

- node insert_books.js

- You should see output indicating successful connection and insertion.

- Run Queries and Operations: After the database is populated, run the queries.js script to execute all the defined queries, aggregations, and indexing demonstrations.

## node queries.js

- The output will be printed to your console, showing the results of each query, aggregation, and the explain() output for index usage.

## MongoDB Database and Collection Details
- Database Name: plp_bookstore

- Collection Name: books

- Both scripts are configured to connect to a MongoDB instance running on mongodb://localhost:27017. If your MongoDB instance is hosted elsewhere (e.g., MongoDB Atlas), you will need to update the uri variable in both insert_books.js and queries.js with your specific connection string.#   M o n g o d b - w k 1 - A s s i g n m e n t 
 
 