const express = require("express");
const router = express.Router();
const redis = require("../db/redis");

const KEY = (sessionId) => `ussd:session:${sessionId}`;

async function getState(sessionId) {
  const raw = await redis.get(KEY(sessionId));

  if (!raw) return { state: "Welcome", data: {} };

  return JSON.parse(raw);
}

async function setState(sessionId, session) {
  await redis.set(KEY(sessionId), JSON.stringify(session), "EX", 180);
}

async function handleUssd({ sessionId, text }) {
  const session = await getState(sessionId);
  const input = text.split("*").pop() || "";

  if (session.state === "Welcome") {
    if (input === "") return "CON Welcome\n1. Add lead\n2. Exit";
    if (input === "1") {
      session.state = "AWAITING_NAME";
      await setState(sessionId, session);
      return "CON ENTER lead name:";
    }
    if (input === "2") return "END Goodbye";
    return "CON Invalid. 1. Add lead 2. Exit";
  }
  if (session.state === "AWAITING_NAME") {
    session.data.name = input;
    session.state = "AWAITING_PHONE";
    await setState(sessionId, session);
    return "CON Enter lead phone";
  }

  if (session.state === "AWAITING_PHONE") {
    if (!/^0\d{9}$/.test(input)) {
      return `CON Invalid phone. Enter lead phone (e.g. 0712345678):`;
    } else {
      session.data.phone = input;
      session.state = "CONFIRM";
      await setState(sessionId, session);
      return `CON Confirm:\nName: ${session.data.name}\nPhone: ${session.data.phone}\n1. Save\n2. Cancel`;
    }
  }
  if (session.state === "CONFIRM") {
    if (input === "1") {
      // TODO Day 3. save to Postgres
      await redis.del(KEY(sessionId));
      return "END lead saved. Asante.";
    }
    if (input === "2") {
      await redis.del(KEY(sessionId));
      return "END Canceled";
    }

    return "CON Invalid. 1.Save 2. Cancel";
  }

  return "END Session error";
}

router.post("/", express.urlencoded({ extended: false }), async (req, res) => {
  const { sessionId, text } = req.body;

  try {
    const response = await handleUssd({ sessionId, text });

    return res.type("text/plain").send(response);
  } catch (err) {
    console.error(err);

    return res.type("text/plain").send("END System temporarily unavailable.");
  }
});

module.exports = router;
