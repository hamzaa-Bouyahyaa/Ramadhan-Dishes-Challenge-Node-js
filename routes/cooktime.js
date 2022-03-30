const express = require("express");
const { getCookTime } = require("../controllers/cooktime.js");
const router = express.Router();

router.get("/cooktime", getCookTime);

module.exports = router;
