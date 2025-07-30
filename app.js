const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Load existing data
let movies = [];
try {
  const data = fs.readFileSync("data.json");
  movies = JSON.parse(data);
} catch (error) {
  movies = [];
}

app.get("/", (req, res) => {
  res.render("form", { error: null });
});

app.post("/submit", (req, res) => {
  const movieName = req.body.movie;
  const rating = parseInt(req.body.rating);

  if (!movieName || isNaN(rating) || rating < 1 || rating > 10) {
    return res.render("form", { error: "Please enter a valid movie name and rating (1-10)." });
  }

  const newMovie = { movie: movieName, rating: rating };
  movies.push(newMovie);
  fs.writeFileSync("data.json", JSON.stringify(movies, null, 2));

  res.render("success", { movie: movieName, rating: rating });
});

app.get("/all", (req, res) => {
  res.render("all", { movies: movies });
});

app.post("/delete", (req, res) => {
  movies = [];
  fs.writeFileSync("data.json", JSON.stringify(movies));
  res.redirect("/all");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
