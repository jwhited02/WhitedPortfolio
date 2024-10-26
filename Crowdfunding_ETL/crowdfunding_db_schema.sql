CREATE TABLE IF NOT EXISTS category (
	category_id VARCHAR(10),
	category VARCHAR(30) NOT NULL,
	Primary Key (category_id)
);

CREATE TABLE IF NOT EXISTS subcategory (
	subcategory_id VARCHAR(10),
	subcategory VARCHAR(30) NOT NULL,
	Primary Key (subcategory_id)
);

CREATE TABLE IF NOT EXISTS contacts (
	contact_id INT,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	email VARCHAR(200) NOT NULL,
	Primary Key (contact_id)
);

CREATE TABLE IF NOT EXISTS campaign (
	cf_id INT,
	contact_id INT NOT NULL references contacts(contact_id),
	company_name VARCHAR(50) NOT NULL,
	description VARCHAR(100) NOT NULL,
	goal FLOAT NOT NULL,
	pledged FLOAT NOT NULL,
	outcome VARCHAR(15) NOT NULL,
	backers_count INT NOT NULL,
	country VARCHAR(5) NOT NULL,
	currency VARCHAR(5) NOT NULL,
	launch_date DATE NOT NULL,
	end_date DATE NOT NULL,
	category_id VARCHAR(50) NOT NULL references category(category_id),
	subcategory_id VARCHAR(50) NOT NULL references subcategory(subcategory_id),
	Primary Key (cf_id)
);

SELECT * FROM category;
SELECT * FROM subcategory;
SELECT * FROM contacts;
SELECT * FROM campaign;