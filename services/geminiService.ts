
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, MessageAuthor } from '../types';
import { SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function formatChatHistoryForPrompt(messages: ChatMessage[]): string {
    const conversation = messages.slice(0, -1);
    if (conversation.length === 0) {
        return "This is the first request.";
    }
    return conversation.map(m => {
        const prefix = m.author === MessageAuthor.USER ? 'User' : 'You (AI)';
        return `${prefix}: ${m.text}`;
    }).join('\n');
}

export const generateComponentCode = async (history: ChatMessage[], currentCode: string): Promise<string> => {
    const latestUserMessage = history[history.length - 1].text;

    const userPrompt = `
Based on my request, generate the new and complete TSX code for the component. You must modify the existing code below.

**My Request:** ${latestUserMessage}

**Existing Code to Modify:**
\`\`\`tsx
${currentCode}
\`\`\`

**Previous Conversation History (for context):**
${formatChatHistoryForPrompt(history)}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.3,
                topP: 0.95,
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });
        
        let generatedText = response.text.trim();

        // Clean up the response to remove markdown backticks if they are still included by the model
        if (generatedText.startsWith('```tsx')) {
            generatedText = generatedText.substring(5, generatedText.length - 3).trim();
        } else if (generatedText.startsWith('```')) {
             generatedText = generatedText.substring(3, generatedText.length - 3).trim();
        }
        
        if (!generatedText.includes('const GeneratedComponent = () =>')) {
             throw new Error("The AI did not return a valid component. It might have responded conversationally. Please try again.");
        }

        return generatedText;

    } catch (error: any) {
        console.error("Error generating component code:", error);
        if (error.message && error.message.includes('xhr error')) {
            throw new Error("A network error occurred while contacting the AI service. Please check your connection and API key.");
        }
        throw new Error(`Failed to generate component from AI: ${error.message || 'An unknown error occurred'}`);
    }
};
