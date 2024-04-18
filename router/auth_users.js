const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const regex = /^[a-zA-Z0-9_]{6,}$/;
  return regex.test(username);
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);

  if (!user) {
    return false;
  }

  return user.password === password;
};

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const existingReview = books[isbn].reviews[username];

  if (existingReview) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.post("/register", function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required queridito" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "User has not reviewed this book" });
  }

  delete book.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});
//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }

  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
