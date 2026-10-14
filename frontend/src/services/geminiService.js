import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function callGemini(prompt) {
  try {
    console.log("Calling Gemini via SDK...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("Gemini response received successfully");
    return response.text;
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    throw error;
  }
}

/**
 * Generate adaptive explanations and jargon list for an article.
 * Returns data shaped to match what ArticleView.jsx expects:
 *   - geminiData.beginner / .intermediate / .advanced  (explanation text)
 *   - geminiData.visualSteps  [{phase, description}, ...]
 *   - geminiData.jargons  [{term, definition, context, level}, ...]
 */
export async function generateAdaptiveExplanations(article) {
  const articleText = article.content || article.description || article.title;
  const prompt = `You are an AI news explainer. Analyze this news article and provide:
1. Explanations at three knowledge levels
2. A visual step breakdown  
3. Key jargon terms that ACTUALLY appear in the article text

Article Title: ${article.title}
Article Content: ${articleText}

Respond in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "beginner": "Simple explanation using everyday language, analogies, and no jargon. 2-3 paragraphs.",
  "intermediate": "Balanced explanation with some technical terms explained in context. 2-3 paragraphs.",
  "advanced": "Expert-level analysis with full technical terminology, implications, and connections to broader trends. 2-3 paragraphs.",
  "visualSteps": [
    {"phase": "Step 1 title", "description": "Step 1 detail"},
    {"phase": "Step 2 title", "description": "Step 2 detail"},
    {"phase": "Step 3 title", "description": "Step 3 detail"},
    {"phase": "Step 4 title", "description": "Step 4 detail"}
  ],
  "jargons": [
    {"term": "exact word from article", "definition": "clear definition", "context": "how it's used in this article", "level": "beginner"},
    {"term": "exact word from article", "definition": "clear definition", "context": "how it's used in this article", "level": "intermediate"},
    {"term": "exact word from article", "definition": "clear definition", "context": "how it's used in this article", "level": "advanced"}
  ]
}

CRITICAL RULES for jargons:
- Every "term" MUST be an EXACT word or short phrase (1-3 words) that literally appears in the article text
- Do NOT invent terms. They must be copy-pasted from the article.
- Include 5-8 beginner-level terms (words a general reader might not know)
- Include 4-6 intermediate-level terms
- Include 3-5 advanced-level terms
- Set "level" field to "beginner", "intermediate", or "advanced" for each term
- The "context" field should explain how the term is used specifically in this article`;

  try {
    const responseText = await callGemini(prompt);
    const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error("Failed to generate explanations:", error);
    return null;
  }
}

/**
 * Interactive Q&A chat about an article using Gemini.
 */
export async function askGeminiQuestion(article, userQuestion, chatHistory = []) {
  const historyText = chatHistory
    .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
    .join("\n");

  const prompt = `You are a helpful AI assistant discussing a news article. Answer the user's question based on the article and conversation context.

Article Title: ${article.title}
Article Content: ${article.content || article.description || ""}

${historyText ? `Previous conversation:\n${historyText}\n` : ""}
User's question: ${userQuestion}

Provide a clear, informative answer in 2-4 sentences. If the question is not related to the article, politely redirect to the article topic.`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.error("Ask Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}