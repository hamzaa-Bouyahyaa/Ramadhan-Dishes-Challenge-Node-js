const express = require("express");
const { getSuggestion } = require("../controllers/suggest");
const router = express.Router();

router.get("/suggest", getSuggestion);

module.exports = router;
