const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

let Users = [
  {
    id: "0",
    name: "Zion",
    username: "ziontarakan",
    password: "",
    email: "",
    birthday: "",
    favorites: ["3"]
  },
  {
    id: "1",
    name: "elon",
    username: "elontarakan",
    password: "",
    email: "",
    birthday: "",
    favorites: ["4"]
  }
];
let Directors = [
  { name: "Christopher Nolan", bio: "", birthyear: "", deathyear: "" },
  { name: "James Cameron", bio: "", birthyear: "", deathyear: "" },
  { name: "Ridley Scott", bio: "", birthyear: "", deathyear: "" },
  { name: "Todd Phillips", bio: "", birthyear: "", deathyear: "" },
  { name: "Francis Ford Coppola", bio: "", birthyear: "", deathyear: "" },
  { name: "Peter Jackson", bio: "", birthyear: "", deathyear: "" },
  { name: "Andrew Niccol", bio: "", birthyear: "", deathyear: "" },
  { name: "Zack Snyder", bio: "", birthyear: "", deathyear: "" }
];

let Genres = [
  {
    name: "SciFi",
    description:
      'Science fiction (often abbreviated Sci-Fi or SF) is a genre of speculative fiction that has been called the "literature of ideas". It typically deals with imaginative and futuristic concepts such as advanced science and technology, time travel, parallel universes, fictional worlds, space exploration, and extraterrestrial life. Science fiction often explores the potential consequences of scientific innovations.'
  },
  {
    name: "Crime",
    description:
      "Crime films, in the broadest sense, are a cinematic genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection."
  },
  {
    name: "Drama",
    description:
      "Drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone"
  },
  {
    name: "Romance",
    description:
      " romance is a narrative genre in literature that involves a mysterious, adventurous, or spiritual story line where the focus is on a quest that involves bravery and strong values, not always a love interest."
  },
  {
    name: "Comedy",
    description:
      "A comedy film is a genre of film in which the main emphasis is on humor."
  }
];

let Movies = [
  {
    id: "0",
    title: "The Dark Knight",
    year: "2008",
    description: "",
    genre: "",
    Director: "Christopher Nolan",
    imageURL: "",
    featured: "false"
  },
  {
    id: "1",
    title: "Titanic",
    year: "1997",
    description:
      "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious,ill-fated R.M.S Titanic.",
    genre: "Romance",
    Director: "James Cameron",
    imageURL: "https://www.imdb.com/title/tt0120338/mediaviewer/rm2647458304",
    featured: "false"
  },
  {
    id: "2",
    title: "Gladiator",
    year: "2000",
    description:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    genre: "Drama",
    Director: "Ridley Scott",
    imageURL: "",
    featured: "false"
  },
  {
    id: "3",
    title: "The Hangover",
    year: "2009",
    description: "",
    genre: "Comedy",
    Director: "Todd Phillips",
    imageURL: "",
    featured: "false"
  },

  {
    id: "4",
    title: "Blade Runner",
    year: "1982",
    description: "",
    genre: "SciFi",
    Director: "Ridley Scott",
    imageURL: "",
    featured: "false"
  },
  {
    id: "5",
    title: "The Godfather",
    year: "1972",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.ty",
    genre: "Crime",
    Director: "Francis Ford Coppola",
    imageURL: "",
    featured: "false"
  },
  {
    id: "6",
    title: "King Kong",
    year: "2005",
    description:
      "A greedy film producer assembles a team of moviemakers and sets out for the infamous Skull Island, where they find more than just cannibalistic natives.",
    genre: "Drama",
    Director: "Peter Jackson",
    imageURL: "",
    featured: "false"
  },
  {
    id: "7",
    title: "Gattaca",
    year: "1997",
    description: "",
    genre: "sciFi",
    Director: "Andrew Niccol",
    imageURL: "",
    featured: "false"
  },
  {
    id: "8",
    title: "300:Rise of an Empire",
    year: "2014",
    description:
      "Greek general Themistokles leads the charge against invading Persian forces led by mortal-turned-god Xerxes and Artemisia, vengeful commander of the Persian navy.",
    genre: "Drama",
    Director: "Zack Snyder",
    imageURL: "",
    featured: "false"
  }
];

// routes all requests for static files to 'public' folder
app.use(express.static("public"));
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.send("Welcome to my movie app!");
});
app.get("/secreturl", function(req, res) {
  res.send("This is a secret url with super top-secret content.");
});

// -- Movies --

// Get the list of data about all movies

app.get("/movies", function(req, res) {
  res.json(Movies);
  res.send("this is a list of movies");
});

app.get("/documentation", function(req, res) {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Get the data about a single Movie, by title
app.get("/Movies/:title", (req, res) => {
  res.json(
    Movies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});

// -- Genres --

// Get the data about a single Genre, by name
app.get("/genres/:name", (req, res) => {
  res.json(
    Genres.find(genre => {
      return genre.name === req.params.name;
    })
  );
});

// -- Directors --

// Get the data about a single Director, by name
app.get("/directors/:name", (req, res) => {
  res.json(
    Directors.find(director => {
      return director.name === req.params.name;
    })
  );
});

// -- Users --

// Get the list of data about all users
app.get("/users", (req, res) => {
  res.json(Users);
});

// Adds data for a new user to the list of Users.
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Deletes a user from the list by ID
app.delete("/users/:id", (req, res) => {
  let user = Users.find(user => {
    return user.id === req.params.id;
  });

  if (user) {
    Users = Users.filter(function(obj) {
      return obj.id !== req.params.id;
    });
    res
      .status(201)
      .send(
        "User " + user.name + " with id " + req.params.id + " was deleted."
      );
  }
});

// Get a user from the list by ID
app.get("/users/:id", (req, res) => {
  res.json(
    Users.find(user => {
      return user.id === req.params.id;
    })
  );
});

// Update the info of a user by id
app.put("/users/:id", (req, res) => {
  let user = Users.find(user => {
    return user.id === req.params.id;
  });
  let newUserInfo = req.body;

  if (user && newUserInfo) {
    // preserve the user id
    newUserInfo.id = user.id;
    // preserve the user favorites
    newUserInfo.favorites = user.favorites;
    // merge old info and new info (TODO: validate new info)
    Object.assign(user, newUserInfo);
    // merge user with update info into the list of Users
    Users = Users.map(user =>
      user.id === newUserInfo.id ? newUserInfo : user
    );
    res.status(201).send(user);
  } else if (!newUserInfo.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    res.status(404).send("User with id " + req.params.id + " was not found.");
  }
});

// -- List of Favorites --

// add a favorite Movie to a User.
app.post("/users/:id/:movie_id", (req, res) => {
  let user = Users.find(user => {
    return user.id === req.params.id;
  });
  let movie = Movies.find(movie => {
    return movie.id === req.params.movie_id;
  });

  if (user && movie) {
    user.favorites = [...new Set([...user.favorites, req.params.movie_id])];
    res.status(201).send(user);
  } else if (!movie) {
    res
      .status(404)
      .send("Movie with id " + req.params.movie_id + " was not found.");
  } else {
    res.status(404).send("User with id " + req.params.id + " was not found.");
  }
});

// remove a favorite Movie from a User.
app.delete("/users/:id/:movie_id", (req, res) => {
  let user = Users.find(user => {
    return user.id === req.params.id;
  });
  let movie = Movies.find(movie => {
    return movie.id === req.params.movie_id;
  });

  if (user && movie) {
    user.favorites = user.favorites.filter(movie_id => {
      return movie_id !== req.params.movie_id;
    });
    res.status(201).send(user);
  } else if (!movie) {
    res
      .status(404)
      .send("Movie with id " + req.params.movie_id + " was not found.");
  } else {
    res.status(404).send("User with id " + req.params.id + " was not found.");
  }
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Sometthing broke !");
  next();
});

app.listen(8080, () => console.log("Myflix is listening on port 8080."));
