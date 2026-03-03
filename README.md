Bitespeed Identity Reconciliation API

This project is a backend service built for the Bitespeed Backend Task.
It implements identity reconciliation logic to link multiple purchases made using different email addresses and phone numbers to a single customer.

🚀 Tech Stack

Runtime: Node.js

Framework: Express.js

Database: PostgreSQL

Query Builder: pg (node-postgres)

Environment Config: dotenv

📌 Problem Statement

FluxKart collects customer contact information during checkout.
Customers may use:

Different emails

Different phone numbers

The goal is to identify whether different contact details belong to the same person and consolidate them correctly.

🗄 Database Schema

Table: Contact

CREATE TABLE Contact (
    id SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(20),
    email VARCHAR(255),
    linkedId INT,
    linkPrecedence VARCHAR(20) CHECK (linkPrecedence IN ('primary', 'secondary')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);
Field Explanation

id → Unique contact ID

phoneNumber → Customer phone

email → Customer email

linkedId → References primary contact

linkPrecedence

"primary" → Oldest contact

"secondary" → Linked to primary

📡 API Endpoint
POST /identify
Request Body (JSON)
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}

At least one field is required.

✅ Response Format
{
  "contact": {
    "primaryContactId": number,
    "emails": ["primaryEmail", "otherEmails"],
    "phoneNumbers": ["primaryPhone", "otherPhones"],
    "secondaryContactIds": [1, 2, 3]
  }
}
🧠 Logic Overview

Search for existing contacts matching email OR phone.

If no match:

Create a new primary contact.

If match exists:

Identify the oldest primary.

Link new data as secondary if needed.

Return consolidated contact details.

📁 Project Structure
Bitespeed/
│
├── package.json
├── .env
├── db.js
├── server.js
└── create-table.sql
⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/your-username/Bitespeed.git
cd Bitespeed
2️⃣ Install Dependencies
npm install
3️⃣ Setup PostgreSQL

Create a database named bitespeed

Run the SQL inside create-table.sql

4️⃣ Configure Environment Variables

Create a .env file:

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/bitespeed
PORT=3000
5️⃣ Start Server
node server.js

Server runs on:

http://localhost:3000
🧪 Example Request
POST /identify
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
Example Response
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "lorraine@hillvalley.edu",
      "mcfly@hillvalley.edu"
    ],
    "phoneNumbers": [
      "123456"
    ],
    "secondaryContactIds": [23]
  }
}
🌍 Deployment

This project can be deployed using:

Render

Railway

Fly.io

Make sure to:

Set environment variable DATABASE_URL

Use PostgreSQL database in production

📎 Notes

GitHub is used for code hosting only.

The backend must be deployed on a server platform.

JSON body must be used (not form-data).
