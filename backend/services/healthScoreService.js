function inferSector(stock) {
  const name = (stock.name || "").toUpperCase();

  if (
    [
      "HDFCBANK",
      "SBIN",
      "ICICIBANK",
      "AXISBANK",
      "KOTAKBANK",
      "BANKBARODA",
      "PNB",
    ].includes(name)
  ) {
    return "Banking";
  }

  if (
    [
      "INFY",
      "TCS",
      "WIPRO",
      "TECHM",
      "KPITTECH",
      "HCLTECH",
      "LTIM",
      "LTTS",
    ].includes(name)
  ) {
    return "Technology";
  }

  if (["RELIANCE", "ONGC", "IOC", "BPCL", "HPCL", "OIL"].includes(name)) {
    return "Energy";
  }

  if (
    [
      "HINDUNILVR",
      "ITC",
      "HUL",
      "NESTLE",
      "BRITANNIA",
      "DABUR",
      "MARICO",
    ].includes(name)
  ) {
    return "FMCG";
  }

  if (
    [
      "MARUTI",
      "M&M",
      "HEROMOTOCO",
      "BAJAJ",
      "EICHERMOT",
      "TATAMOTORS",
    ].includes(name)
  ) {
    return "Automobile";
  }

  if (["BHARTIARTL", "AIRTEL", "VODAFONE", "IDEA"].includes(name)) {
    return "Telecom";
  }

  if (["SGBMAY29"].includes(name)) {
    return "Commodity";
  }

  if (["CASH", "FD", "MONEYMARKET"].includes(name)) {
    return "Cash";
  }

  return "Other";
}

function calculateHealthScore(
  portfolio,
  sectorAllocation,
  overallProfitPercent,
) {
  const normalizedPortfolio = portfolio.map((stock) => ({
    ...stock,
    sector: stock.sector || inferSector(stock),
  }));

  const totalValue = normalizedPortfolio.reduce(
    (sum, stock) => sum + (Number(stock.holdingValue) || 0),
    0,
  );

  const sectors = normalizedPortfolio.reduce((acc, stock) => {
    const sector = stock.sector;
    const value = Number(stock.holdingValue) || 0;

    if (!acc[sector]) {
      acc[sector] = { sector, value: 0, holdings: 0 };
    }

    acc[sector].value += value;
    acc[sector].holdings += 1;
    return acc;
  }, {});

  const sectorValues = Object.values(sectors);
  const numberOfStocks = normalizedPortfolio.length;
  const numberOfSectors = sectorValues.length;
  const averageReturn =
    normalizedPortfolio.reduce(
      (sum, stock) => sum + Number(stock.profitPercent || 0),
      0,
    ) / Math.max(numberOfStocks, 1);

  const profitableStocks = normalizedPortfolio.filter(
    (stock) => Number(stock.profit || 0) > 0,
  ).length;
  const lossStocks = normalizedPortfolio.filter(
    (stock) => Number(stock.profit || 0) < 0,
  ).length;

  const concentrationRatio =
    totalValue > 0
      ? Math.max(...sectorValues.map((sector) => sector.value / totalValue), 0)
      : 0;

  const diversificationScore = Math.max(
    1,
    Math.min(10, Number((10 * (1 - concentrationRatio)).toFixed(1))),
  );

  const healthPenalty =
    (numberOfStocks < 5 ? 16 : numberOfStocks < 8 ? 8 : 0) +
    (numberOfSectors < 3 ? 12 : numberOfSectors < 5 ? 6 : 0) +
    (concentrationRatio > 0.5 ? 18 : concentrationRatio > 0.35 ? 10 : 0) +
    (overallProfitPercent < 0 ? 12 : 0) +
    (averageReturn < 0 ? 8 : 0) +
    (lossStocks > profitableStocks ? 8 : 0);

  const portfolioHealthScore = Math.max(0, Math.min(100, 100 - healthPenalty));

  let riskScore = 2;

  if (concentrationRatio > 0.5) riskScore += 3;
  else if (concentrationRatio > 0.35) riskScore += 2;
  else if (concentrationRatio > 0.2) riskScore += 1;

  if (overallProfitPercent < 0) riskScore += 2;
  if (numberOfSectors <= 3) riskScore += 2;
  if (lossStocks > profitableStocks) riskScore += 1;

  riskScore = Math.min(10, riskScore);

  let riskLevel = "Low";
  if (riskScore >= 7) riskLevel = "High";
  else if (riskScore >= 4) riskLevel = "Moderate";

  let diversificationLevel = "Poor";
  if (diversificationScore >= 9) diversificationLevel = "Excellent";
  else if (diversificationScore >= 7) diversificationLevel = "Good";
  else if (diversificationScore >= 5) diversificationLevel = "Moderate";

  return {
    portfolioHealthScore,
    diversificationScore,
    riskScore,
    riskLevel,
    diversificationLevel,
  };
}

module.exports = {
  calculateHealthScore,
};
