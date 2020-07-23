const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser");
// // uuid = require("uuid");
const passport = require("passport");
require("./passport");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect("mongodb://localhost:27017/myFlixDB", {
// useNewUrlParser: true,
//useUnifiedTopology: true,
//});

mongoose.connect(
  process.env.CONNECTION_URI,

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();

// routes all requests for static files to 'public' folder
app.use(express.static("public"));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());

var allowedOrigins = ["http://localhost:1234", "*"];

//var allowedOrigins = ["http://localhost:8080", "http://localhost:1234"];

let auth = require("./auth")(app);

app.get("/", function (req, res) {
  res.send("Welcome to my movie app!");
});
app.get("/secreturl", function (req, res) {
  res.send("This is a secret url with super top-secret content.");
});

// -- Movies --

// Get the list of data about all movies
app.get("/movies", passport.authenticate("jwt", { session: false }), function (
  req,
  res
) {
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
app.get("/Movies/:Title", function (req, res) {
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
      res.status(200).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Adds data for a new user to the list of Users.
app.post(
  "/users",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

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

//Update user info by username
// /* We’ll expect JSON in this format
// {
//   Username: String,
//   (required)
//   Password: String,
//   (required)
//   Email: String,
//   (required)
//   Birthday: Date
// }*/
app.put("/users/:Username", function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, //this line makes sure that the updated document is returned
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

// Update the info of a user by id
//app.put(
//"/users/:Username",
// Validation logic here for request
//you can either use a chain of methods like .not().isEmpty()
//which means "opposite of isEmpty" in plain english "is not empty"
//or use .isLength({min: 5}) which means
//minimum value of 5 characters are only allowed
//

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
app.delete("/users/:Username/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { Favorites: req.params.MovieID },
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
  res.status(500).send("Something broke !");
  next();
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

//app.listen(8080, () => console.log("Myflix is listening on port 8080."));

// const express = require("express"),
//   morgan = require("morgan"),
//   bodyParser = require("body-parser"),
//   //uuid = require("uuid");
//   mongoose = require("mongoose");
// Models = require("./models.js");
// //cors = require("cors");
// const app = express();
// const Movies = Models.Movie;
// const Users = Models.User;
// // local connection
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// //mongoose.connect("mongodb://localhost:27017/myflixDB", {
// //useNewUrlParser: true,
// //});

// app.use(morgan("common"));
// app.use(express.static("public"));
// app.use(bodyParser.json());

// //list of all movies
// app.get("/", function (req, res) {
//   return res.status(400).send("Welcome to my Flix App");
// });

// app.get("/movies", function (req, res) {
//   Movies.find()
//     .then(function (movies) {
//       res.status(201).json(movies);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });
// //get information about movie by title
// app.get("/movies/:Title", function (req, res) {
//   Movies.findOne({ Title: req.params.Title })
//     .then(function (movies) {
//       res.json(movies);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

// //get data about director
// app.get("/movies/director/:Name", function (req, res) {
//   Movies.findOne({ "Director.Name": req.params.Name })
//     .then(function (movies) {
//       res.json(movies);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

// //get data about genre by name
// app.get("/movies/genres/:Name", function (req, res) {
//   Movies.findOne({ "Genre.Name": req.params.Name })
//     .then(function (movies) {
//       res.json(movies.Genre);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });
// app.get("/genres/:name", (req, res) => {
//   Movies.find({ "Genre.Name": req.params.name })
//     .then(function (movie) {
//       res.json(movie);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error:" + err);
//     });
// });

// //get list of users
// app.get("/users", function (req, res) {
//   Users.find()
//     .then(function (users) {
//       res.status(201).json(users);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

// //get a user by username
// app.get("/users/:Username", function (req, res) {
//   Users.findOne({ Username: req.params.Username })
//     .then(function (user) {
//       res.json(user);
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

// //Add new user
// /* We’ll expect JSON in this format
// {
//  ID : Integer,
//  Username : String,
//  Password : String,
//  Email : String,
//  Birthday : Date
// }*/

// app.post("/users", (req, res) => {
//   var errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }
//   var hashedPassword = Users.hashPassword(req.body.Password);
//   Users.findOne({ Username: req.body.Username })
//     .then(function (user) {
//       if (user) {
//         return res.status(400).send(req.body.Username + " already exists");
//       } else {
//         Users.create({
//           Username: req.body.Username,
//           Password: hashedPassword,
//           Email: req.body.Email,
//           Birthday: req.body.Birthday,
//         })
//           .then(function (user) {
//             res.status(201).json(user);
//           })
//           .catch(function (error) {
//             console.error(error);
//             res.status(500).send("Error: " + error);
//           });
//       }
//     })
//     .catch(function (error) {
//       console.error(error);
//       res.status(500).send("Error: " + error);
//     });
// });
// // delete user from the list by username
// app.delete("/users/:Username", function (req, res) {
//   Users.findOneAndRemove({ Username: req.params.Username })
//     .then(function (user) {
//       if (!user) {
//         res.status(400).send(req.params.Username + " was not found");
//       } else {
//         res.status(200).send(req.params.Username + " was deleted.");
//       }
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

// // Update user info by username
// /* We’ll expect JSON in this format
// {
//   Username: String,
//   (required)
//   Password: String,
//   (required)
//   Email: String,
//   (required)
//   Birthday: Date
// }*/
// app.put("/users/:Username", function (req, res) {
//   var errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }
//   var hashedPassword = Users.hashPassword(req.body.Password);
//   Users.findOneAndUpdate(
//     { Username: req.params.Username },
//     {
//       $set: {
//         Username: req.body.Username,
//         Password: hashedPassword,
//         Email: req.body.Email,
//         Birthday: req.body.Birthday,
//       },
//     },
//     { new: true }, //this line makes sure that the updated document is returned
//     function (err, updatedUser) {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error: " + err);
//       } else {
//         res.json(updatedUser);
//       }
//     }
//   );
// });

// // Add movie to favorites list
// app.post("/users/:Username/Movies/:MovieID", function (req, res) {
//   Users.findOneAndUpdate(
//     { Username: req.params.Username },
//     {
//       $push: { Favorites: req.params.MovieID },
//     },

//     { new: true }, // This line makes sure that the updated document is returned
//     function (err, updatedUser) {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error: " + err);
//       } else {
//         res.json(updatedUser);
//       }
//     }
//   );
// });

// // delete movie from favorite list for user
// app.delete("/users/:Username/Movies/:MovieID", function (req, res) {
//   Users.findOneAndUpdate(
//     { Username: req.params.Username },
//     { $pull: { Favorites: req.params.MovieID } },
//     { new: true },
//     function (err, updatedUser) {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error: " + err);
//       } else {
//         res.json(updatedUser);
//       }
//     }
//   );
// });

// var port = process.env.PORT || 8080;
// app.listen(port, "0.0.0.0", function () {
//   console.log("Listening on port 8080");
// });
