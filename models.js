// const mongoose = require("mongoose");

// let movieSchema = mongoose.Schema({
//   Title: { type: String, required: true },
//   Description: { type: String, required: true },
//   Genre: {
//     Name: { type: String },
//     Description: { type: String },
//   },
//   Director: {
//     Name: { type: String },
//     Bio: { type: String },
//   },
//   ImagePath: { type: String },
//   Featured: { type: Boolean },
// });

// let userSchema = mongoose.Schema({
//   Username: { type: String, required: true },
//   Password: { type: String, required: true },
//   Email: { type: String, required: true },
//   Birthday: { type: Date },
//   Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
// });
// let Movie = mongoose.model("Movie", movieSchema);
// let User = mongoose.model("user", userSchema);

// module.exports.Movie = Movie;
// module.exports.User = User;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  ImagePath: String,
  Featured: Boolean,
});

var userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

var Movie = mongoose.model("Movie", movieSchema);
var User = mongoose.model("user", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
