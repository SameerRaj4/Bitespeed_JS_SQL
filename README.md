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
