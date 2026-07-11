import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AutoAwesome,
  AccountBalance,
  TrendingUp,
  Security,
  Schedule,
  VolunteerActivism,
  Insights,
} from "@mui/icons-material";
import "./PersonalizedAdvisor.css";

const initialForm = {
  age: "",
  occupation: "",
  monthlyIncome: "",
  goal: "",
  riskTolerance: "Medium",
  horizon: "",
  emergencyFund: "",
  investments: [],
  sectors: [],
  preference: "",
};

const steps = [
  {
    key: "about",
    title: "About You",
    subtitle:
      "Let us understand your profile so the plan feels personal and relevant.",
  },
  {
    key: "goal",
    title: "Investment Goal",
    subtitle:
      "Choose the main objective that best matches your financial vision.",
  },
  {
    key: "risk",
    title: "Risk Tolerance",
    subtitle:
      "We will align the plan to how much volatility you can comfortably handle.",
  },
  {
    key: "horizon",
    title: "Investment Horizon",
    subtitle: "Your time frame shapes the right mix of growth and stability.",
  },
  {
    key: "emergency",
    title: "Emergency Fund",
    subtitle:
      "A healthy safety cushion helps you stay resilient through uncertainty.",
  },
  {
    key: "investments",
    title: "Current Investments",
    subtitle:
      "Tell us what you already hold so we can build around your existing setup.",
  },
  {
    key: "sectors",
    title: "Preferred Sectors",
    subtitle: "Choose the market areas you want your strategy to emphasize.",
  },
  {
    key: "preference",
    title: "Investment Preference",
    subtitle:
      "Pick the style that best reflects the outcome you want to target.",
  },
];

const occupationOptions = [
  "Student",
  "Engineer",
  "Doctor",
  "Business",
  "Government Employee",
  "Self-employed",
  "Other",
];

const incomeOptions = ["Less than ₹25k", "₹25k-₹50k", "₹50k-₹1L", "₹1L+"];
const goals = [
  "Wealth Creation",
  "Retirement",
  "Passive Income",
  "Emergency Fund",
  "Buying House",
  "Child Education",
  "Other",
];
const riskLevels = ["Very Low", "Low", "Medium", "High", "Very High"];
const horizons = ["1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"];
const emergencyOptions = [
  "Less than 3 Months",
  "3-6 Months",
  "6-12 Months",
  "More than 12 Months",
];
const investmentOptions = [
  "Stocks",
  "Mutual Funds",
  "Gold",
  "ETF",
  "Fixed Deposits",
  "Crypto",
  "Real Estate",
];
const sectorOptions = [
  "Technology",
  "Banking",
  "Healthcare",
  "Pharma",
  "Power",
  "Energy",
  "Infrastructure",
  "FMCG",
  "Automobile",
  "Telecommunications",
  "Defence",
  "AI",
];
const preferences = [
  "Highest Growth",
  "Balanced",
  "Lowest Risk",
  "Dividend Income",
  "Long Term Wealth",
];

const PersonalizedAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return Boolean(
          formData.age && formData.occupation && formData.monthlyIncome,
        );
      case 1:
        return Boolean(formData.goal);
      case 2:
        return Boolean(formData.riskTolerance);
      case 3:
        return Boolean(formData.horizon);
      case 4:
        return Boolean(formData.emergencyFund);
      case 5:
        return Boolean(formData.investments.length);
      case 6:
        return Boolean(formData.sectors.length);
      case 7:
        return Boolean(formData.preference);
      default:
        return true;
    }
  };

  const handleNext = () => {
    setErrorMessage("");
    if (!isStepValid()) {
      setErrorMessage("Please complete this step before continuing.");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setErrorMessage("");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      setErrorMessage(
        "Please complete the final step before generating insights.",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/personalized-advisor",
        formData,
      );
      sessionStorage.setItem(
        "personalizedAdvisorForm",
        JSON.stringify(formData),
      );
      navigate("/personalized-report", {
        state: { reportData: response.data, formData },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to generate your personalized advisor insights right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="advisor-shell">
      <section className="advisor-hero">
        <div>
          <div className="advisor-eyebrow">
            <AutoAwesome fontSize="small" /> Personalized Wealth Planning
          </div>
          <h1>Personalized Investment Advisor</h1>
          <p>
            Tell us about yourself and your investment goals. We will combine
            your profile, preferences, and portfolio context to craft a premium,
            strategy-led outlook.
          </p>
        </div>
        <div className="advisor-hero-illustration">
          <Insights className="advisor-hero-icon" />
        </div>
      </section>

      <section className="advisor-form-card">
        <div className="form-progress">
          <div style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="progress-labels">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{steps[currentStep].title}</span>
        </div>

        <h2 className="step-title">{steps[currentStep].title}</h2>
        <p className="step-subtitle">{steps[currentStep].subtitle}</p>

        {currentStep === 0 ? (
          <div className="grid-2">
            <div className="field-card">
              <label>Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => updateField("age", e.target.value)}
              />
            </div>
            <div className="field-card">
              <label>Occupation</label>
              <select
                value={formData.occupation}
                onChange={(e) => updateField("occupation", e.target.value)}
              >
                <option value="">Select occupation</option>
                {occupationOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-card">
              <label>Monthly Income</label>
              <select
                value={formData.monthlyIncome}
                onChange={(e) => updateField("monthlyIncome", e.target.value)}
              >
                <option value="">Choose income range</option>
                {incomeOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-card">
              <label>Profile Snapshot</label>
              <input
                value={`${formData.age || "—"} • ${formData.occupation || "—"}`}
                readOnly
              />
            </div>
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="choice-grid">
            {goals.map((goal) => (
              <div
                key={goal}
                className={`choice-card ${formData.goal === goal ? "active" : ""}`}
                onClick={() => updateField("goal", goal)}
              >
                <strong>{goal}</strong>
                <span>Aligned to your long-term outcome</span>
              </div>
            ))}
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="choice-grid">
            {riskLevels.map((level) => (
              <div
                key={level}
                className={`choice-card ${formData.riskTolerance === level ? "active" : ""}`}
                onClick={() => updateField("riskTolerance", level)}
              >
                <strong>{level}</strong>
                <span>Choose the right volatility band</span>
              </div>
            ))}
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="choice-grid">
            {horizons.map((horizon) => (
              <div
                key={horizon}
                className={`choice-card ${formData.horizon === horizon ? "active" : ""}`}
                onClick={() => updateField("horizon", horizon)}
              >
                <strong>{horizon}</strong>
                <span>Time horizon for your strategy</span>
              </div>
            ))}
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="choice-grid">
            {emergencyOptions.map((option) => (
              <div
                key={option}
                className={`choice-card ${formData.emergencyFund === option ? "active" : ""}`}
                onClick={() => updateField("emergencyFund", option)}
              >
                <strong>{option}</strong>
                <span>Protection against market surprises</span>
              </div>
            ))}
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="choice-grid">
            {investmentOptions.map((option) => (
              <div
                key={option}
                className={`choice-card ${formData.investments.includes(option) ? "active" : ""}`}
                onClick={() => toggleArrayValue("investments", option)}
              >
                <strong>{option}</strong>
                <span>
                  {formData.investments.includes(option)
                    ? "Selected"
                    : "Add to profile"}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {currentStep === 6 ? (
          <div className="chip-grid">
            {sectorOptions.map((sector) => (
              <button
                key={sector}
                type="button"
                className={`chip ${formData.sectors.includes(sector) ? "active" : ""}`}
                onClick={() => toggleArrayValue("sectors", sector)}
              >
                {sector}
              </button>
            ))}
          </div>
        ) : null}

        {currentStep === 7 ? (
          <div className="choice-grid">
            {preferences.map((preference) => (
              <div
                key={preference}
                className={`choice-card ${formData.preference === preference ? "active" : ""}`}
                onClick={() => updateField("preference", preference)}
              >
                <strong>{preference}</strong>
                <span>Pick the style that best fits your objective</span>
              </div>
            ))}
          </div>
        ) : null}

        {errorMessage ? <div className="error-text">{errorMessage}</div> : null}

        <div className="form-actions">
          <button
            className="form-btn secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            type="button"
          >
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              className="form-btn primary"
              onClick={handleNext}
              type="button"
            >
              Next
            </button>
          ) : (
            <button
              className="form-btn primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting
                ? "Generating..."
                : "Generate Personalized Insights"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default PersonalizedAdvisor;
