const {
  enrichPortfolio,
  calculateSectorAllocation,
  getTopPerformers,
  getWorstPerformers,
  getLargestHolding,
  getWeightedReturn,
} = require("../utils/portfolioHelpers");

const { calculateHealthScore } = require("./healthScoreService");

function analyzePortfolioData(holdings) {
  // ==========================
  // Portfolio Calculations
  // ==========================

  const portfolio = enrichPortfolio(holdings);

  // ==========================
  // Basic Stats
  // ==========================

  const totalInvestment = portfolio.reduce(
    (sum, stock) => sum + stock.qty * stock.avg,
    0,
  );

  const currentValue = portfolio.reduce(
    (sum, stock) => sum + stock.holdingValue,
    0,
  );

  const overallProfit = currentValue - totalInvestment;

  const overallProfitPercent =
    totalInvestment === 0
      ? 0
      : Number(((overallProfit / totalInvestment) * 100).toFixed(2));

  const numberOfStocks = portfolio.length;

  const numberOfSectors = new Set(portfolio.map((stock) => stock.sector)).size;

  // ==========================
  // Sector Allocation
  // ==========================

  const sectorAllocation = calculateSectorAllocation(portfolio);

  // ==========================
  // Performers
  // ==========================

  const topPerformers = getTopPerformers(portfolio);

  const worstPerformers = getWorstPerformers(portfolio);

  // ==========================
  // Insights
  // ==========================

  const portfolioInsights = {
    largestHolding: getLargestHolding(portfolio),
    weightedReturn: getWeightedReturn(portfolio),
    profitableStocks: portfolio.filter((stock) => stock.profit > 0).length,
    lossStocks: portfolio.filter((stock) => stock.profit < 0).length,
  };

  // ==========================
  // Health Score
  // ==========================

  const health = calculateHealthScore(
    portfolio,
    sectorAllocation,
    overallProfitPercent,
  );

  // ==========================
  // Final Stats
  // ==========================

  const portfolioStats = {
    totalInvestment: Number(totalInvestment.toFixed(2)),
    currentValue: Number(currentValue.toFixed(2)),
    overallProfit: Number(overallProfit.toFixed(2)),
    overallProfitPercent,
    numberOfStocks,
    numberOfSectors,

    portfolioHealthScore: health.portfolioHealthScore,

    riskScore: health.riskScore,

    diversificationScore: health.diversificationScore,

    riskLevel: health.riskLevel,

    diversificationLevel: health.diversificationLevel,
  };

  return {
    portfolio,
    portfolioStats,
    sectorAllocation,
    topPerformers,
    worstPerformers,
    portfolioInsights,
  };
}

module.exports = {
  analyzePortfolioData,
};
