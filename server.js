const express = require("express");
const mongoose = require("mongoose");

const app = express();

//DB Config

const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//Connect to MongoDB
mongoose
  .connect(db)
  .then(success => console.log("Connected to database"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("hello");
});

//Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
