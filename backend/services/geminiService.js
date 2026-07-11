const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GOOGLE_GENAI_API_KEY;

let model = null;

if (apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  } catch (error) {
    console.error("Gemini client initialization failed:", error.message);
  }
}

async function getGeminiResponse(prompt) {
  if (!model) {
    throw new Error("Gemini API key is missing or invalid.");
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response) {
      throw new Error("No response received from Gemini.");
    }

    let text = response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("Failed to generate AI response.");
  }
}

module.exports = {
  getGeminiResponse,
};
