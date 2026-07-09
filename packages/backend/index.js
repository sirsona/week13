require("dotenv").config();
const express = require("express");
const ussdRoute = require("./src/routes/ussd");

const app = express();

app.use("/ussd", ussdRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
