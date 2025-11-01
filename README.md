# Jewelry Website

## Overview
This project is a jewelry website that showcases various jewelry products. It includes a user-friendly interface for browsing products and an admin interface for managing product data.

## Project Structure
```
jewelry-website
├── public
│   ├── index.html          # Main HTML document
│   ├── css
│   │   └── styles.css      # Styles for the website
│   ├── js
│   │   └── main.js         # JavaScript for client-side interactions
│   └── assets
│       ├── fonts           # Directory for font files
│       └── images          # Directory for image files
├── server
│   ├── app.js              # Main entry point for the server
│   ├── routes
│   │   ├── index.js        # Main routes for the application
│   │   └── api.js          # API routes for product handling
│   ├── controllers
│   │   └── productsController.js # Logic for product-related operations
│   ├── models
│   │   └── product.js      # Product model definition
│   └── db
│       ├── migrations
│       │   └── create_tables.sql # SQL commands for table creation
│       └── queries.js      # Functions for executing SQL queries
├── db
│   └── schema.sql          # Database schema definition
├── package.json             # npm configuration file
├── .gitignore               # Files to ignore in version control
└── README.md                # Project documentation
```

## Features
- User-friendly interface for browsing jewelry products.
- Dynamic content updates using JavaScript.
- SQLite database for storing product information.
- RESTful API for managing product data.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd jewelry-website
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up the database:
   - Run the SQL commands in `db/schema.sql` to create the database schema.
   - Run the migrations in `server/db/migrations/create_tables.sql` to create necessary tables.
5. Start the server:
   ```
   node server/app.js
   ```
6. Open your browser and navigate to `http://localhost:3000` to view the website.

## Usage
- Browse through the jewelry products on the homepage.
- Admin users can access the API to manage product data.

## License
This project is licensed under the MIT License.