const express = require("express");
const router = express.Router();

const { chatWithAI, analyzePortfolio } = require("../controllers/aiController");

router.post("/chat", chatWithAI);

router.post("/analyze-portfolio", analyzePortfolio);

module.exports = router;
