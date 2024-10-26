# Crowdfunding_ETL
Names: Finn Arffmann, Parisha Gupta, Sanem Gingery, John McNamara, and Jackson Whited
Class: Northwestern Data Bootcamp
Date: 7/23/2024

Files For Grading:

- ETL_Mini_Project_FArffmann_PGupta_SGingery_JMcNamara_JWhited.ipynb
- QuickDBD-ETL_Mini_Project_ERD.png
- crowdfunding_db_schema.sql
- campaign.csv
- category.csv
- contacts.csv
- subcategory.csv

Project Overview

This ETL (Extract, Transform, Load) Mini Project is a collaborative effort aimed at creating a database from a set of Excel files related to crowdfunding campaigns. The project is divided into four main tasks: creating Category and Subcategory DataFrames, creating the Campaign DataFrame, creating the Contacts DataFrame, and setting up the Crowdfunding Database. Below are the detailed instructions and steps we followed to accomplish each task.

1. Create the Category and Subcategory DataFrames

a) Category DataFrame

We began by extracting and transforming data from the crowdfunding.xlsx file to create a Category DataFrame. This DataFrame includes:

    category_id: Sequentially generated entries from "cat1" to "catn", where n represents the number of unique categories.
    category: Titles of the categories.

The resulting DataFrame was exported as category.csv and saved to our GitHub repository.

b) Subcategory DataFrame

Similarly, we extracted and transformed the data to create a Subcategory DataFrame, which includes:

    subcategory_id: Sequentially generated entries from "subcat1" to "subcatn", where n represents the number of unique subcategories.
    subcategory: Titles of the subcategories.

This DataFrame was exported as subcategory.csv and saved to our GitHub repository.

2. Create the Campaign DataFrame

We extracted and transformed the data from crowdfunding.xlsx to create a Campaign DataFrame with the following columns:

    cf_id
    contact_id
    company_name
    description (renamed from "blurb")
    goal (converted to float)
    pledged (converted to float)
    outcome
    backers_count
    country
    currency
    launch_date (renamed from "launched_at" and converted to datetime)
    end_date (renamed from "deadline" and converted to datetime)
    category_id (matched with the Category DataFrame)
    subcategory_id (matched with the Subcategory DataFrame)

This DataFrame was exported as campaign.csv and saved to our GitHub repository.

3. Create the Contacts DataFrame

We imported data from the contacts.xlsx file and extracted the contact_id, name, and email columns using regular expressions. The contact_id column was converted to integer type, and the name column was split into first_name and last_name. The cleaned DataFrame was exported as contacts.csv and saved to our GitHub repository.

4. Create the Crowdfunding Database

a) ERD and Table Schema

We inspected the four CSV files and created an Entity-Relationship Diagram (ERD) using QuickDBD. Using the ERD, we defined the table schema, including data types, primary keys, foreign keys, and other constraints. The schema was saved as crowdfunding_db_schema.sql. The ERD was saved as QuickDBD-ETL_Mini_Project_ERD.png. Both were uploaded to our GitHub repository.

b) Database Creation

We created a new Postgres database named crowdfunding_db and used the schema to create the tables in the correct order to manage foreign keys. Each table was verified with a SELECT statement to ensure successful creation.

c) Data Import

Finally, we imported each CSV file into its corresponding SQL table and verified the data with SELECT statements to ensure the correctness of the data.

5. Conclusion

This ETL Mini Project demonstrates our ability to extract, transform, and load data into a structured database, following best practices for data handling and database management. The project files, including the transformed data and database schema, are available in this GitHub repository for further reference and use.
