const express = require("express");
const router = express.Router();
const clamp = require("../utils");

router.post("/", express.urlencoded({ extended: false }), (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  console.log({ sessionId, serviceCode, phoneNumber, text });

  let response = "";
  if (text === "") {
    response = clamp(
      "CON Welcome to Mctaba CRM\n1. My leads\n2. New lead\n3. Exit",
      180,
    );
  } else if (text === "1") {
    response = clamp("END Your leads feature is coming soon.", 180);
  } else if (text === "2") {
    response = clamp("END New lead feature is coming soon.", 180);
  } else if (text === "3") {
    response = clamp("END Asante. Bye.", 180);
  } else {
    response = clamp("END Invalid option.", 180);
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

module.exports = router;
