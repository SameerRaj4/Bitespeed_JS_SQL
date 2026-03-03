const express = require("express");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({
      message: "Either email or phoneNumber required"
    });
  }

  try {
    const { rows: matched } = await pool.query(
      `SELECT * FROM Contact
       WHERE (email = $1 OR phoneNumber = $2)
       AND deletedAt IS NULL
       ORDER BY createdAt ASC`,
      [email || null, phoneNumber || null]
    );

    if (matched.length === 0) {
      const { rows } = await pool.query(
        `INSERT INTO Contact (email, phoneNumber, linkPrecedence)
         VALUES ($1, $2, 'primary')
         RETURNING *`,
        [email, phoneNumber]
      );

      return res.json(buildResponse(rows));
    }

    let primary = matched.find(c => c.linkprecedence === "primary");

    if (!primary) {
      primary = matched[0];
      const { rows } = await pool.query(
        `SELECT * FROM Contact WHERE id = $1`,
        [primary.linkedid]
      );
      primary = rows[0];
    }

    const primaryId = primary.id;

    const { rows: cluster } = await pool.query(
      `SELECT * FROM Contact
       WHERE (id = $1 OR linkedId = $1)
       AND deletedAt IS NULL
       ORDER BY createdAt ASC`,
      [primaryId]
    );

    const emailExists = cluster.some(c => c.email === email);
    const phoneExists = cluster.some(c => c.phonenumber === phoneNumber);

    if (!emailExists || !phoneExists) {
      await pool.query(
        `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence)
         VALUES ($1, $2, $3, 'secondary')`,
        [email, phoneNumber, primaryId]
      );
    }

    const { rows: finalCluster } = await pool.query(
      `SELECT * FROM Contact
       WHERE (id = $1 OR linkedId = $1)
       AND deletedAt IS NULL
       ORDER BY createdAt ASC`,
      [primaryId]
    );

    res.json(buildResponse(finalCluster));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

function buildResponse(contacts) {
  const primary = contacts.find(c => c.linkprecedence === "primary");

  const emails = [...new Set(contacts.map(c => c.email).filter(Boolean))];
  const phones = [...new Set(contacts.map(c => c.phonenumber).filter(Boolean))];

  const secondaryIds = contacts
    .filter(c => c.linkprecedence === "secondary")
    .map(c => c.id);

  return {
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaryIds
    }
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});