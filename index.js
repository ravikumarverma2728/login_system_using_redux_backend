const express = require("express");
const PORT = process.env.PORT || 8000;
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const users = require("./routes/user");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Server started on port 8000`);
});

try {
  mongoose.connect(process.env.DB_LINK, () => console.log("Connected to DB!"));
} catch (error) {
  console.log(error);
}

//3K29AtQ08cWVVHc6
