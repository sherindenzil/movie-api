const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser");
// uuid = require("uuid");

const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

//let Users = [
//  {
//   id: "0",
//   name: "Zion",
// username: "ziontarakan",
//password: "",
// email: "",
//  birthday: "",
// favorites: ["3"]
// },
// {
// id: "1",
// name: "elon",
// username: "elontarakan",
// password: "",
// email: "",
// birthday: "",
// favorites: ["4"]
//}
//];
//let Directors = [
//{ name: "Christopher Nolan", bio: "", birthyear: "", deathyear: "" },
//{ name: "James Cameron", bio: "", birthyear: "", deathyear: "" },
//{ name: "Ridley Scott", bio: "", birthyear: "", deathyear: "" },
// { name: "Todd Phillips", bio: "", birthyear: "", deathyear: "" },
//{ name: "Francis Ford Coppola", bio: "", birthyear: "", deathyear: "" },
//{ name: "Peter Jackson", bio: "", birthyear: "", deathyear: "" },
//{ name: "Andrew Niccol", bio: "", birthyear: "", deathyear: "" },
//{ name: "Zack Snyder", bio: "", birthyear: "", deathyear: "" }
//];

//let Genres = [
//{
// name: "SciFi",
//description:
//'Science fiction (often abbreviated Sci-Fi or SF) is a genre of speculative fiction that has been called the "literature of ideas". It typically deals with imaginative and futuristic concepts such as advanced science and technology, time travel, parallel universes, fictional worlds, space exploration, and extraterrestrial life. Science fiction often explores the potential consequences of scientific innovations.'
//},
//{
//name: "Crime",
//description:
//"Crime films, in the broadest sense, are a cinematic genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection."
//},
//{
//name: "Drama",
//description:
//"Drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone"
//},
// {
//name: "Romance",
//description:
//" romance is a narrative genre in literature that involves a mysterious, adventurous, or spiritual story line where the focus is on a quest that involves bravery and strong values, not always a love interest."
//},
//{
// name: "Comedy",
//description:
//"A comedy film is a genre of film in which the main emphasis is on humor."
//}
//];

//let Movies = [
// {
// id: "0",
//title: "The Dark Knight",
//year: "2008",
//description: "",
//genre: "",
// Director: "Christopher Nolan",
//imageURL: "",
//featured: "false"
//},
//{
//id: "1",
// title: "Titanic",
//year: "1997",
//description:
// "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious,ill-fated R.M.S Titanic.",
//genre: "Romance",
// Director: "James Cameron",
// imageURL: "https://www.imdb.com/title/tt0120338/mediaviewer/rm2647458304",
//featured: "false"
// }];

// routes all requests for static files to 'public' folder
app.use(express.static("public"));
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Welcome to my movie app!");
});
app.get("/secreturl", function (req, res) {
  res.send("This is a secret url with super top-secret content.");
});

// -- Movies --

// Get the list of data about all movies

app.get("/movies", function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/documentation", function (req, res) {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Get the data about a single Movie, by title
app.get("/Movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(function (movie) {
      res.json(movie);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// -- Genres --

// Get the data about a single Genre, by name
app.get("/genres/:name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.name })
    .then(function (movie) {
      res.json(movie);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

// -- Directors --

// Get the data about a single Director, by name
app.get("/directors/:name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
    .then(function (movies) {
      res.json(movies.Director);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

// -- Users --

// Get the list of data about all users
app.get("/users", (req, res) => {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Adds data for a new user to the list of Users.
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Deletes a user from the list by ID
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user from the list by ID
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then(function (user) {
      res.json(user);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update the info of a user by id
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// -- List of Favorites --

// add a favorite Movie to a User.
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { Favorites: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// remove a favorite Movie from a User.
app.delete("/users/:Username/:movie_id", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { Favorit_movie: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Sometthing broke !");
  next();
});

app.listen(8080, () => console.log("Myflix is listening on port 8080."));
