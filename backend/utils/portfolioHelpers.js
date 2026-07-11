// ===============================
// Portfolio Helper Functions
// ===============================

/**
 * Calculate holding value
 */
function calculateHoldingValue(stock) {
  return Number((stock.qty * stock.price).toFixed(2));
}

/**
 * Calculate invested value
 */
function calculateInvestment(stock) {
  return Number((stock.qty * stock.avg).toFixed(2));
}

/**
 * Calculate profit
 */
function calculateProfit(stock) {
  return Number(
    (calculateHoldingValue(stock) - calculateInvestment(stock)).toFixed(2),
  );
}

/**
 * Calculate profit %
 */
function calculateProfitPercent(stock) {
  return Number((((stock.price - stock.avg) / stock.avg) * 100).toFixed(2));
}

/**
 * Calculate total portfolio value
 */
function calculatePortfolioValue(portfolio) {
  return Number(
    portfolio
      .reduce((sum, stock) => sum + calculateHoldingValue(stock), 0)
      .toFixed(2),
  );
}

/**
 * Calculate total investment
 */
function calculateTotalInvestment(portfolio) {
  return Number(
    portfolio
      .reduce((sum, stock) => sum + calculateInvestment(stock), 0)
      .toFixed(2),
  );
}

/**
 * Calculate allocation %
 */
function calculateAllocation(stock, totalPortfolioValue) {
  if (totalPortfolioValue === 0) return 0;

  return Number(
    ((calculateHoldingValue(stock) / totalPortfolioValue) * 100).toFixed(2),
  );
}

/**
 * Return enriched portfolio
 */
function enrichPortfolio(portfolio) {
  const totalPortfolioValue = calculatePortfolioValue(portfolio);

  return portfolio.map((stock) => ({
    ...stock.toObject(),

    holdingValue: calculateHoldingValue(stock),

    investment: calculateInvestment(stock),

    profit: calculateProfit(stock),

    profitPercent: calculateProfitPercent(stock),

    allocation: calculateAllocation(stock, totalPortfolioValue),
  }));
}

/**
 * Sector Allocation
 */
function calculateSectorAllocation(portfolio) {
  const totalValue = calculatePortfolioValue(portfolio);

  const sectors = {};

  portfolio.forEach((stock) => {
    if (!sectors[stock.sector]) {
      sectors[stock.sector] = {
        sector: stock.sector,
        currentValue: 0,
        stocks: 0,
      };
    }

    sectors[stock.sector].currentValue += stock.holdingValue;
    sectors[stock.sector].stocks += 1;
  });

  return Object.values(sectors)
    .map((sector) => ({
      ...sector,

      currentValue: Number(sector.currentValue.toFixed(2)),

      allocation: Number(((sector.currentValue / totalValue) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.allocation - a.allocation);
}

/**
 * Top Performers
 */
function getTopPerformers(portfolio, count = 3) {
  return [...portfolio]
    .sort((a, b) => b.profitPercent - a.profitPercent)
    .slice(0, count);
}

/**
 * Worst Performers
 */
function getWorstPerformers(portfolio, count = 3) {
  return [...portfolio]
    .sort((a, b) => a.profitPercent - b.profitPercent)
    .slice(0, count);
}

/**
 * Highest allocation stock
 */
function getLargestHolding(portfolio) {
  if (!portfolio.length) return null;

  return [...portfolio].sort((a, b) => b.holdingValue - a.holdingValue)[0];
}

/**
 * Smallest allocation stock
 */
function getSmallestHolding(portfolio) {
  return [...portfolio].sort((a, b) => a.allocation - b.allocation)[0];
}

/**
 * Winners count
 */
function getProfitableStocks(portfolio) {
  return portfolio.filter((stock) => stock.profit > 0).length;
}

/**
 * Losers count
 */
function getLossStocks(portfolio) {
  return portfolio.filter((stock) => stock.profit < 0).length;
}

/**
 * Average Return %
 */
function getWeightedReturn(portfolio) {
  if (!portfolio.length) return 0;

  const totalValue = calculatePortfolioValue(portfolio);

  if (totalValue === 0) return 0;

  const weightedReturn = portfolio.reduce((sum, stock) => {
    const weight = stock.holdingValue / totalValue;
    return sum + stock.profitPercent * weight;
  }, 0);

  return Number(weightedReturn.toFixed(2));
}

module.exports = {
  enrichPortfolio,

  calculatePortfolioValue,

  calculateTotalInvestment,

  calculateSectorAllocation,

  getTopPerformers,

  getWorstPerformers,

  getLargestHolding,

  getSmallestHolding,

  getProfitableStocks,

  getLossStocks,

  getWeightedReturn,
};
