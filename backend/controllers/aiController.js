const { HoldingsModel } = require("../model/HoldingsModel");

const { getGeminiResponse } = require("../services/geminiService");

const {
  analyzePortfolioData,
} = require("../services/portfolioAnalysisService");

const { createPortfolioPrompt } = require("../prompts/portfolioPrompt");

function buildAnalysisResponse(analysisData) {
  return {
    portfolioStats: analysisData.portfolioStats,
    portfolio: analysisData.portfolio,
    sectorAllocation: analysisData.sectorAllocation,
    topPerformers: analysisData.topPerformers,
    worstPerformers: analysisData.worstPerformers,
    portfolioInsights: analysisData.portfolioInsights,
    generatedAt: new Date().toISOString(),
  };
}

function buildFallbackAiSummary(responsePayload) {
  const stats = responsePayload.portfolioStats || {};
  const portfolio = responsePayload.portfolio || [];
  const topPerformers = responsePayload.topPerformers || [];
  const worstPerformers = responsePayload.worstPerformers || [];
  const sectorAllocation = responsePayload.sectorAllocation || [];
  const largestHolding = responsePayload.portfolioInsights?.largestHolding;

  const strengths = [];
  if (stats.overallProfit > 0) {
    strengths.push(
      `Your portfolio is currently showing a positive overall profit of ₹${stats.overallProfit.toFixed(2)}.`,
    );
  }
  if (topPerformers[0]) {
    strengths.push(
      `${topPerformers[0].name} is one of your strongest holdings with a ${topPerformers[0].profitPercent}% return.`,
    );
  }
  if (stats.numberOfSectors > 1) {
    strengths.push(
      `Your investments are spread across ${stats.numberOfSectors} sectors, which supports diversification.`,
    );
  }
  if (largestHolding) {
    strengths.push(
      `The largest position is ${largestHolding.name}, giving the portfolio a clear anchor holding.`,
    );
  }
  if (sectorAllocation[0]) {
    strengths.push(
      `${sectorAllocation[0].sector} is your largest sector allocation at ${sectorAllocation[0].allocation}%.`,
    );
  }
  while (strengths.length < 7) {
    strengths.push(
      "Your portfolio has a solid mix of holdings that can be reviewed over time.",
    );
  }

  const weaknesses = [];
  if (stats.overallProfit < 0) {
    weaknesses.push(
      `The portfolio is currently showing a negative overall profit, so the current position needs attention.`,
    );
  }
  if (worstPerformers[0]) {
    weaknesses.push(
      `${worstPerformers[0].name} is underperforming compared with the rest of the portfolio.`,
    );
  }
  if (sectorAllocation[0] && sectorAllocation[0].allocation > 30) {
    weaknesses.push(
      `Sector concentration is high in ${sectorAllocation[0].sector}, which can increase risk.`,
    );
  }
  if (stats.riskScore >= 7) {
    weaknesses.push(
      `The portfolio risk score is elevated, so exposure should be monitored carefully.`,
    );
  }
  if (
    portfolio.length > 0 &&
    portfolio.filter((item) => item.profit < 0).length > 0
  ) {
    weaknesses.push(
      `Some holdings are currently in loss territory and may require closer review.`,
    );
  }
  while (weaknesses.length < 6) {
    weaknesses.push(
      "Portfolio concentration and performance should be reviewed regularly.",
    );
  }

  const recommendations = [
    "Review the largest holding regularly to understand how much of the portfolio it represents.",
    "Track underperforming stocks alongside the broader portfolio trend rather than reacting to a single day move.",
    "Compare sector allocation with your comfort level for concentration and diversification.",
    "Use the portfolio health score as a simple checkpoint for reviewing progress over time.",
    "Keep an eye on profit and loss changes so you can understand whether performance is improving or weakening.",
  ];

  const beginnerExplanation = `This portfolio shows how your holdings are performing overall. The total portfolio value is ₹${stats.currentValue?.toFixed(2) || 0}, while the total investment is ₹${stats.totalInvestment?.toFixed(2) || 0}. The portfolio has generated an overall profit of ₹${stats.overallProfit?.toFixed(2) || 0}, which is a ${stats.overallProfitPercent || 0}% change from the invested amount. The health score and diversification score help explain whether the portfolio is balanced and how risk is spread across different holdings. If some sectors are more heavily weighted, that can raise concentration risk, while strong performers can support growth. Reviewing the top and bottom performers helps you understand which investments are carrying the portfolio and which ones may need more attention.`;

  return {
    summary: `Your portfolio currently stands at ₹${stats.currentValue?.toFixed(2) || 0} with an overall profit of ₹${stats.overallProfit?.toFixed(2) || 0}. The portfolio is showing a ${stats.overallProfitPercent || 0}% change from the invested amount and carries a health score of ${stats.portfolioHealthScore || 0}. The portfolio is spread across ${stats.numberOfSectors || 0} sectors and has a risk score of ${stats.riskScore || 0}. The strongest signals come from the positive performers and the current diversification structure, while the weakest areas are the holdings that are underperforming relative to the portfolio.`,
    strengths: strengths.slice(0, 7),
    weaknesses: weaknesses.slice(0, 6),
    sectorAnalysis: (sectorAllocation || []).map((sector) => ({
      sector: sector.sector,
      allocation: sector.allocation,
      comment: `${sector.sector} accounts for ${sector.allocation}% of the portfolio. This is a ${sector.allocation >= 20 ? "High" : sector.allocation >= 10 ? "Moderate" : "Low"} allocation and has a ${sector.allocation >= 20 ? "strong" : sector.allocation >= 10 ? "meaningful" : "limited"} impact on diversification.`,
    })),
    recommendations: recommendations.slice(0, 5),
    beginnerExplanation,
  };
}

// ----------------------------
// AI Chat
// ----------------------------

async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const reply = await getGeminiResponse(message);

    res.json({ reply });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate AI response.",
    });
  }
}

// ----------------------------
// Portfolio Analyzer
// ----------------------------

async function analyzePortfolio(req, res) {
  try {
    const holdings = await HoldingsModel.find({});

    if (holdings.length === 0) {
      return res.status(404).json({
        error: "Portfolio is empty.",
      });
    }

    const analysisData = analyzePortfolioData(holdings);
    const responsePayload = buildAnalysisResponse(analysisData);

    let aiSummary = buildFallbackAiSummary(responsePayload);

    try {
      const prompt = createPortfolioPrompt(responsePayload);
      const aiResponse = await getGeminiResponse(prompt);
      const parsedSummary = JSON.parse(aiResponse);
      if (parsedSummary && typeof parsedSummary === "object") {
        aiSummary = {
          ...aiSummary,
          ...parsedSummary,
          strengths: parsedSummary.strengths?.length
            ? parsedSummary.strengths
            : aiSummary.strengths,
          weaknesses: parsedSummary.weaknesses?.length
            ? parsedSummary.weaknesses
            : aiSummary.weaknesses,
          recommendations: parsedSummary.recommendations?.length
            ? parsedSummary.recommendations
            : aiSummary.recommendations,
          beginnerExplanation:
            parsedSummary.beginnerExplanation || aiSummary.beginnerExplanation,
          summary: parsedSummary.summary || aiSummary.summary,
        };
      }
    } catch (error) {
      console.warn("Gemini summary skipped or invalid:", error.message);
    }

    res.status(200).json({
      ...responsePayload,
      aiSummary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Portfolio analysis failed.",
    });
  }
}

module.exports = {
  chatWithAI,
  analyzePortfolio,
};
