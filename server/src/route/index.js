const express = require("express");
const router = express.Router();

const post = require("./post");

router.use("/", post);

router.get("/", (req, res) => {
  res.status(200).json("App is started!");
});

module.exports = router;
