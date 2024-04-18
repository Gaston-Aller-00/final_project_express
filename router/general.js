const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required queridito" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get("/", function (req, res) {
  return res.status(200).json(Object.values(books));
});
//get book por isbn
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = findBookByISBN(isbn);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//get book by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = findBooksByAuthor(author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Books by author not found" });
  }
});

//get book by author
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = findBooksByTitle(title);
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "Book not found " });
  }
});

//get book by review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = getBookReviews(isbn);
  if (bookReviews) {
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ message: "book review not found :(" });
  }
});

function findBookByISBN(isbn) {
  for (let key in books) {
    if (books[key].isbn === isbn) {
      return books[key];
    }
  }
  return null;
}

function findBooksByAuthor(author) {
  const booksByAuthor = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  }
  return booksByAuthor;
}

function findBooksByTitle(title) {
  const booksByTitle = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  }
  return booksByTitle;
}

function getBookReviews(isbn) {
  const book = books[isbn];
  if (book) {
    return book.reviews;
  } else {
    return null;
  }
}

module.exports.general = public_users;
