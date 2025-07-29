import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage, MessageAuthor } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ VITE_GEMINI_API_KEY is not set in your environment variables.");
}

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

function formatChatHistory(messages: ChatMessage[]): string {
  const conversation = messages.slice(0, -1);
  return conversation.length === 0
    ? "This is the first request."
    : conversation
        .map(m => `${m.author === MessageAuthor.USER ? "User" : "AI"}: ${m.text}`)
        .join("\n");
}

export const generateComponentCode = async (
  history: ChatMessage[],
  currentCode: string
): Promise<string> => {
  const latestUserMessage = history[history.length - 1]?.text || "";

  const userPrompt = `
Based on my request, generate the new and complete TSX code for the component. Modify the existing code.

**My Request:** ${latestUserMessage}

**Existing Code:**
\`\`\`tsx
${currentCode}
\`\`\`

**Conversation:**
${formatChatHistory(history)}
`;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.3,
        topP: 0.9
      }
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }]
    });

    let generatedText = result.response.text().trim();

    // Clean markdown
    generatedText = generatedText
      .replace(/^```tsx\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .trim();

    if (!generatedText.includes("const GeneratedComponent")) {
      throw new Error("❌ Invalid AI response: No component found.");
    }

    return generatedText;
  } catch (error: any) {
    console.error("Error generating component:", error);
    throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
  }
};
