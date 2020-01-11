const express = require("express"),
  morgan = require("morgan");

const app = express();

app.use(morgan("common"));

let topMovies = [
  {
    title: "The Dark Knight",
    Director: "Christopher Nolan"
  },
  {
    title: "Titanic",
    Director: "James Cameron"
  },
  {
    title: "Gladiator",
    Director: "Ridley Scott"
  },
  {
    title: "The Hangover",
    Director: "Todd Phillips"
  },

  {
    title: "avatar",
    Director: "James Cameron"
  },
  {
    title: "The Godfather",
    Director: "Francis Ford Coppola"
  },
  {
    title: "King Kong",
    Director: "Peter Jackson"
  },
  {
    title: "Life of Pi",
    Director: "Ang Lee"
  },
  {
    title: "300",
    Director: "Zack Snyder"
  },
  {
    title: "Troy",
    Director: "Wolfgang Petersen"
  }
];
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.send("Welcome to my movie app!");
});
app.get("/secreturl", function(req, res) {
  res.send("This is a secret url with super top-secret content.");
});
app.get("/movies", function(req, res) {
  res.json(topMovies);
});
app.get("/documentation", function(req, res) {
  res.sendFile("public/documentation.html", { root: __dirname });
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Sometthing broke !");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
