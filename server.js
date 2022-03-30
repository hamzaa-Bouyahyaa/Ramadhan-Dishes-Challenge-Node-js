const express = require("express");
const cookTimeRoutes = require("./routes/cooktime.js");
const suggestRoutes = require("./routes/suggest.js");

const app = express();
app.use("", cookTimeRoutes);
app.use("", suggestRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server Running on port 3000");
});
