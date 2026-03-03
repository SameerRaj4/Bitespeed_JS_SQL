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

CREATE INDEX idx_email ON Contact(email);
CREATE INDEX idx_phone ON Contact(phoneNumber);