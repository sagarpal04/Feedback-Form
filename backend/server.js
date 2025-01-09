const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "feedback_form", // Change to your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Fetch questions from the database
app.get("/api/questions", (req, res) => {
  const query = "SELECT * FROM questions";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Save responses to the database
app.post("/api/responses", (req, res) => {
  const { user_name, responses } = req.body; // Include user_name in the request body
  const values = responses.map((response) => [
    user_name,
    response.question_id,
    response.user_response,
  ]);

  const query =
    "INSERT INTO responses (user_name, question_id, user_response) VALUES ?";
  db.query(query, [values], (err, results) => {
    if (err) throw err;
    res.json({ success: true, message: "Responses saved successfully" });
  });
});
app.get("/api/responses", (req, res) => {
  const query = `
    SELECT 
      responses.user_name, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'question', questions.question_text,
          'user_response', responses.user_response
        )
      ) AS responses
    FROM responses
    JOIN questions ON responses.question_id = questions.id
    GROUP BY responses.user_name
  `;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.delete("/api/responses/:user_name", (req, res) => {
  const { user_name } = req.params;
  const query = `DELETE FROM responses WHERE user_name = ?`;
  db.query(query, [user_name], (err, results) => {
    if (err) throw err;
    res.json({ success: true, message: "All responses deleted for the user." });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
