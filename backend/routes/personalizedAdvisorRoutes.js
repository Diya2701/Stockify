const express = require("express");
const router = express.Router();

const { getGeminiResponse } = require("../services/geminiService");

function sanitizeArray(val) {
  if (!Array.isArray(val)) return [];
  return val.filter((x) => x !== null && x !== undefined);
}

function sanitizeNumber(n, fallback) {
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
}

function buildProfileSpecificContent(profile) {
  const goal = String(profile?.goal || "Wealth Creation");
  const riskTolerance = String(profile?.riskTolerance || "Medium");
  const horizon = String(profile?.horizon || "5-10 Years");
  const preference = String(profile?.preference || "Balanced");
  const emergencyFund = String(profile?.emergencyFund || "Not specified");
  const investments = sanitizeArray(profile?.investments);
  const sectors = sanitizeArray(profile?.sectors);
  const age = Number(profile?.age);
  const monthlyIncome = String(profile?.monthlyIncome || "");
  const hasHighIncome = /₹1L|1l|100k|100000|\+/.test(monthlyIncome);
  const isYoung = Number.isFinite(age) && age < 35;
  const isMiddle = Number.isFinite(age) && age >= 35 && age < 50;
  const riskLabel = riskTolerance.toLowerCase();

  const ageNarrative = isYoung
    ? "Because you are still in an early wealth-building stage, compounding and long-term consistency matter most."
    : isMiddle
      ? "Because you are in a career-building phase, balancing growth with stability is the right priority."
      : "Because you are closer to major life goals or retirement, protecting capital and keeping liquidity strong matters more.";

  const incomeNarrative = hasHighIncome
    ? "Your income profile gives you room to invest more steadily and systematically."
    : "Your income profile suggests keeping contributions disciplined and avoiding overexposure to volatile ideas.";

  const suggestions = [
    `${ageNarrative} Focus on ${goal.toLowerCase()} with a phased plan rather than trying to time the market.`,
    `${incomeNarrative} Review your allocation around ${horizon.toLowerCase()} and your comfort with ${riskTolerance.toLowerCase()} risk.`,
    `Use ${sectors.slice(0, 2).join(" and ") || "a diversified mix of sectors"} as a guide, but keep your portfolio balanced across themes and asset classes.`,
  ];

  const warnings = [
    isYoung
      ? "Avoid taking too much risk just because you have a long horizon; discipline matters more than excitement."
      : isMiddle
        ? "Do not let mid-career cash-flow changes push you into an overly aggressive portfolio."
        : "Do not ignore liquidity needs and drawdown risk as your time horizon shortens.",
    emergencyFund === "Not specified"
      ? "Your emergency fund should be clarified before increasing exposure to volatile assets."
      : `Your emergency fund of ${emergencyFund} should be reviewed against your expected obligations.`,
    investments.length
      ? "Existing holdings should be checked for concentration so one bet does not dominate your plan."
      : "A portfolio without a clear base allocation can drift over time.",
  ];

  const nextSteps = [
    isYoung
      ? "Set up a monthly investing habit and automate contributions toward your long-term goal."
      : isMiddle
        ? "Rebalance your portfolio every quarter and align it with your changing income and obligations."
        : "Protect liquidity, review retirement exposure, and simplify your portfolio where possible.",
    `Anchor decisions to ${goal.toLowerCase()} and revisit them whenever your income, risk tolerance, or horizons change.`,
    preference.toLowerCase().includes("risk")
      ? "Keep a stronger cash buffer while you build confidence in your chosen strategy."
      : "Track performance on a monthly basis instead of reacting to daily headlines.",
  ];

  const resources = [
    {
      title: isYoung
        ? "Systematic Investing Basics"
        : isMiddle
          ? "Portfolio Rebalancing"
          : "Retirement Readiness",
      description: isYoung
        ? "Learn how SIPs, compounding, and recurring investments can smooth your build-up over time."
        : isMiddle
          ? "Understand how a disciplined rebalancing routine helps preserve risk balance as life changes."
          : "Learn how to preserve capital, manage withdrawals, and stay aligned with long-term goals.",
    },
    {
      title: hasHighIncome ? "Cash Flow Planning" : "Emergency Fund Planning",
      description: hasHighIncome
        ? "Match your investing plan to your rising income so your contributions stay consistent and intentional."
        : "Use a reserve that supports your essential needs before committing more capital to riskier assets.",
    },
    {
      title:
        riskLabel.includes("high") || riskLabel.includes("very high")
          ? "Risk Control"
          : "Diversification",
      description:
        riskLabel.includes("high") || riskLabel.includes("very high")
          ? "Use position sizing and a clear review process to keep volatility manageable."
          : "Spread exposure across asset classes and sectors so one theme does not dominate outcomes.",
    },
  ];

  const notes = `${ageNarrative} ${incomeNarrative} Keep the plan aligned with ${goal.toLowerCase()} and your ${horizon.toLowerCase()} horizon.`;

  return { suggestions, warnings, nextSteps, resources, notes };
}

function buildFallbackAdvisorReport(profile) {
  const goal = profile?.goal || "Wealth Creation";
  const riskTolerance = profile?.riskTolerance || "Medium";
  const horizon = profile?.horizon || "5-10 Years";
  const preference = profile?.preference || "Balanced";
  const emergencyFund = profile?.emergencyFund || "Not specified";
  const investments = sanitizeArray(profile?.investments);
  const sectors = sanitizeArray(profile?.sectors);
  const age = Number(profile?.age);
  const monthlyIncome = String(profile?.monthlyIncome || "");
  const hasHighIncome = /₹1L|1l|100k|100000|\+/.test(monthlyIncome);
  const isYoung = Number.isFinite(age) && age < 35;

  let score = 74;
  if (isYoung) score += 5;
  if (hasHighIncome) score += 4;
  if (String(riskTolerance).toLowerCase().includes("high")) score += 3;
  if (String(horizon).toLowerCase().includes("10")) score += 2;
  score = Math.min(95, Math.max(68, score));

  const riskAlignment = Math.min(95, Math.max(62, score - 2));
  const growthReadiness = Math.min(95, Math.max(65, score + 3));

  const riskLabel = String(riskTolerance).toLowerCase();
  const riskPersonality =
    riskLabel.includes("high") || riskLabel.includes("very high")
      ? `You are comfortable with stronger swings and can support a growth-first strategy for ${goal.toLowerCase()}.`
      : riskLabel.includes("low") || riskLabel.includes("very low")
        ? `You prefer stability and capital preservation, so a conservative path is better suited for ${goal.toLowerCase()}.`
        : `You are balanced and can stay invested through short-term volatility while targeting ${goal.toLowerCase()}.`;

  const investmentStyle =
    String(preference).toLowerCase().includes("growth") ||
    String(preference).toLowerCase().includes("wealth")
      ? `A growth-oriented approach that combines quality holdings with a disciplined long-term plan for ${goal.toLowerCase()}.`
      : String(preference).toLowerCase().includes("risk")
        ? `A conservative style focused on resilience, liquidity, and steady progress toward ${goal.toLowerCase()}.`
        : `A balanced style that blends steady allocation with opportunistic exposure for ${goal.toLowerCase()}.`;

  const allocation =
    riskLabel.includes("high") || riskLabel.includes("very high")
      ? [
          { label: "Equity", value: 55 },
          { label: "Debt", value: 15 },
          { label: "Gold", value: 10 },
          { label: "Cash", value: 10 },
          { label: "Alternatives", value: 10 },
        ]
      : riskLabel.includes("low") || riskLabel.includes("very low")
        ? [
            { label: "Debt", value: 40 },
            { label: "Equity", value: 30 },
            { label: "Gold", value: 15 },
            { label: "Cash", value: 10 },
            { label: "Alternatives", value: 5 },
          ]
        : [
            { label: "Equity", value: 45 },
            { label: "Debt", value: 25 },
            { label: "Gold", value: 10 },
            { label: "Cash", value: 10 },
            { label: "Alternatives", value: 10 },
          ];

  const strengths = [
    `Your goal of ${goal.toLowerCase()} suggests a clear direction for investing.`,
    investments.length
      ? `You already have exposure across ${investments.slice(0, 3).join(", ")}.`
      : "You have a strong chance to build a more deliberate portfolio from the ground up.",
    sectors.length
      ? `Your preferred sectors of ${sectors.slice(0, 3).join(", ")} give your plan a focused theme.`
      : "You can use diversification to reduce concentration risk while staying aligned with your objective.",
  ];

  const weaknesses = [
    emergencyFund === "Not specified"
      ? "Your emergency fund position is not yet clear, so liquidity planning should be tightened."
      : `Your emergency fund of ${emergencyFund} should be reviewed against your expected obligations.`,
    investments.length
      ? "Existing holdings may need rebalancing if they are too concentrated in one area."
      : "A portfolio without a clear base allocation can drift over time.",
    `Your current preference for ${preference.toLowerCase()} should be paired with regular review to avoid overreaction.`,
  ];

  const profileSpecific = buildProfileSpecificContent(profile);

  const warnings = profileSpecific.warnings;

  const missingSectors =
    sectors.length >= 3
      ? sectors.slice(0, 3).map((sector) => `${sector} exposure`)
      : ["Defence exposure", "Infrastructure exposure", "Healthcare exposure"];

  const suggestions = profileSpecific.suggestions;

  const nextSteps = profileSpecific.nextSteps;

  const resources = profileSpecific.resources;

  return {
    score,
    riskAlignment,
    growthReadiness,
    riskPersonality,
    investmentStyle,
    profile: {
      name: profile?.name || profile?.occupation || "Investor",
      age: profile?.age || "",
      occupation: profile?.occupation || "",
      goal,
      riskTolerance,
      horizon,
    },
    allocation,
    strengths: strengths.slice(0, 7),
    weaknesses: weaknesses.slice(0, 7),
    warnings: warnings.slice(0, 6),
    missingSectors: missingSectors.slice(0, 7),
    suggestions: suggestions.slice(0, 6),
    nextSteps: nextSteps.slice(0, 6),
    resources,
    notes: profileSpecific.notes,
  };
}

function buildFallbackChatReply(question, context) {
  const profile = context?.profile || {};
  const goal = String(profile.goal || "your goal");
  const riskTolerance = String(profile.riskTolerance || "medium");
  const horizon = String(profile.horizon || "your time horizon");
  const age = profile.age
    ? `for someone aged ${profile.age}`
    : "for your profile";
  const text = String(question || "")
    .trim()
    .toLowerCase();

  let answer = `Based on your advisor profile ${age}, a practical next step is to align your investments with ${goal.toLowerCase()} over ${horizon.toLowerCase()} while staying within a ${riskTolerance.toLowerCase()} risk posture.`;

  if (text.includes("risk") || text.includes("volatility")) {
    answer +=
      " Keep your exposure controlled and avoid overreacting to short-term swings.";
  } else if (
    text.includes("return") ||
    text.includes("profit") ||
    text.includes("gain")
  ) {
    answer +=
      " Focus on steady progress and consistency rather than chasing quick gains.";
  } else if (
    text.includes("sector") ||
    text.includes("stock") ||
    text.includes("investment")
  ) {
    answer +=
      " Review how each idea fits your goal, horizon, and risk comfort before adding it.";
  } else if (text.includes("emergency") || text.includes("cash")) {
    answer +=
      " Make sure your emergency reserve is in place before increasing exposure to higher-risk assets.";
  } else if (text.includes("retire") || text.includes("retirement")) {
    answer +=
      " Prioritize capital preservation and liquidity as your planning horizon shortens.";
  } else {
    answer +=
      " For now, review your emergency fund, keep contributions consistent, and avoid making large changes based on short-term market noise.";
  }

  return `${answer} If you want more specific help, ask about a particular asset, sector, or allocation idea.`;
}

function buildPersonalizedAdvisorPrompt(profile) {
  const safeProfile = {
    age: profile?.age ?? "—",
    occupation: profile?.occupation ?? "—",
    monthlyIncome: profile?.monthlyIncome ?? "—",
    goal: profile?.goal ?? "Wealth Creation",
    riskTolerance: profile?.riskTolerance ?? "Medium",
    horizon: profile?.horizon ?? "5-10 Years",
    emergencyFund: profile?.emergencyFund ?? "—",
    investments: sanitizeArray(profile?.investments),
    sectors: sanitizeArray(profile?.sectors),
    preference: profile?.preference ?? "Balanced",
  };

  return `You are a financial planning assistant. Using the user profile below, generate a personalized investment advisor report.

Constraints:
- Output MUST be a single valid JSON object.
- Keys must match exactly:
  score, riskAlignment, growthReadiness, riskPersonality, investmentStyle,
  profile, allocation, strengths, weaknesses, warnings, missingSectors, suggestions,
  nextSteps, resources, notes
- allocation MUST be an array of objects: { label: string, value: number } and values should sum to 100.
- strengths: array of 3-7 strings.
- weaknesses: array of 3-7 strings.
- warnings: array of 2-6 strings.
- missingSectors: array of 3-7 strings.
- suggestions: array of 2-6 strings.
- nextSteps: array of 2-6 strings.
- resources: array of objects { title: string, description: string } (2-4 items)
- score/riskAlignment/growthReadiness must be numbers 0-100.
- Make the insights specific to the user's age, occupation, income, goals, horizon, risk tolerance, emergency fund, preferred sectors, and investment preference.
- Avoid vague generic advice; each strength, weakness, suggestion, warning, and note should feel personalized and actionable.
- Do not reuse the same advice for a 22-year-old and a 50-year-old. Tailor the suggestions, warnings, resources, and next steps to the user’s life stage and income profile.
- If the user is young, emphasize compounding, consistency, and long-term growth. If the user is older or more conservative, emphasize capital preservation, liquidity, and retirement readiness.

Profile:
${JSON.stringify(safeProfile, null, 2)}

Now generate the report.`;
}

function normalizeReport(raw) {
  const r = raw && typeof raw === "object" ? raw : {};

  const profile = r.profile && typeof r.profile === "object" ? r.profile : {};

  const allocation = sanitizeArray(r.allocation).map((a) => ({
    label: a?.label ?? "",
    value: sanitizeNumber(a?.value, 0),
  }));

  const safeAllocation = allocation.filter((item) => item.label || item.value);

  const resources = sanitizeArray(r.resources).map((x) => ({
    title: x?.title ?? "Resource",
    description: x?.description ?? "",
  }));

  const score = sanitizeNumber(r.score, 0);
  const riskAlignment = sanitizeNumber(r.riskAlignment, 0);
  const growthReadiness = sanitizeNumber(r.growthReadiness, 0);

  const scoreBand =
    score >= 85 ? "Strong Fit" : score >= 70 ? "Solid Fit" : "Needs Review";
  const riskBand =
    riskAlignment >= 80
      ? "Well Aligned"
      : riskAlignment >= 65
        ? "Balanced"
        : "Needs Attention";
  const growthBand =
    growthReadiness >= 80
      ? "Growth Ready"
      : growthReadiness >= 65
        ? "Momentum Building"
        : "Needs More Preparation";

  return {
    score,
    riskAlignment,
    growthReadiness,
    scoreBand,
    riskBand,
    growthBand,
    riskPersonality:
      typeof r.riskPersonality === "string" && r.riskPersonality.trim()
        ? r.riskPersonality
        : "",
    investmentStyle:
      typeof r.investmentStyle === "string" && r.investmentStyle.trim()
        ? r.investmentStyle
        : "",
    profile: {
      name: profile.name ?? profile.occupation ?? "",
      age: profile.age ?? "",
      occupation: profile.occupation ?? "",
      goal: profile.goal ?? "",
      riskTolerance: profile.riskTolerance ?? "",
      horizon: profile.horizon ?? "",
    },
    allocation: safeAllocation,
    strengths: sanitizeArray(r.strengths).slice(0, 7),
    weaknesses: sanitizeArray(r.weaknesses).slice(0, 7),
    warnings: sanitizeArray(r.warnings).slice(0, 6),
    missingSectors: sanitizeArray(r.missingSectors).slice(0, 7),
    suggestions: sanitizeArray(r.suggestions).slice(0, 6),
    nextSteps: sanitizeArray(r.nextSteps).slice(0, 6),
    resources: resources.slice(0, 4),
    notes: typeof r.notes === "string" && r.notes.trim() ? r.notes : "",
  };
}

router.post("/personalized-advisor", async (req, res) => {
  try {
    const profile = req.body || {};

    const prompt = buildPersonalizedAdvisorPrompt(profile);
    let aiResponse;

    try {
      aiResponse = await getGeminiResponse(prompt);
    } catch (error) {
      aiResponse = buildFallbackAdvisorReport(profile);
    }

    let parsed;
    try {
      parsed =
        typeof aiResponse === "string" ? JSON.parse(aiResponse) : aiResponse;
    } catch (e) {
      parsed = buildFallbackAdvisorReport(profile);
    }

    const profileSpecific = buildProfileSpecificContent(profile);

    const mergedParsed = {
      ...parsed,
      profile: {
        ...(parsed?.profile || {}),
        age: profile?.age || parsed?.profile?.age || "",
        occupation: profile?.occupation || parsed?.profile?.occupation || "",
        goal: profile?.goal || parsed?.profile?.goal || "Wealth Creation",
        riskTolerance:
          profile?.riskTolerance || parsed?.profile?.riskTolerance || "Medium",
        horizon: profile?.horizon || parsed?.profile?.horizon || "5-10 Years",
      },
      suggestions:
        Array.isArray(parsed?.suggestions) &&
        parsed.suggestions.some((item) => String(item).length > 40)
          ? parsed.suggestions
          : profileSpecific.suggestions,
      nextSteps:
        Array.isArray(parsed?.nextSteps) &&
        parsed.nextSteps.some((item) => String(item).length > 40)
          ? parsed.nextSteps
          : profileSpecific.nextSteps,
      warnings:
        Array.isArray(parsed?.warnings) &&
        parsed.warnings.some((item) => String(item).length > 20)
          ? parsed.warnings
          : profileSpecific.warnings,
      resources:
        Array.isArray(parsed?.resources) && parsed.resources.length >= 2
          ? parsed.resources
          : profileSpecific.resources,
      notes:
        typeof parsed?.notes === "string" && parsed.notes.trim().length > 40
          ? parsed.notes
          : profileSpecific.notes,
    };

    const report = normalizeReport(mergedParsed);
    return res.json(report);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unable to generate advisor insights" });
  }
});

module.exports = router;
