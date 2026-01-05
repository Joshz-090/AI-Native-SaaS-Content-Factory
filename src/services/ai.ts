import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateContent(topic: string, tone?: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    You are a professional content marketer. 
    Generate a high-converting social media post about "${topic}".
    Tone: ${tone || "Professional and engaging"}.
    
    Output MUST be in valid JSON format:
    {
      "headline": "...",
      "body": "...",
      "hashtags": ["...", "..."],
      "imagePrompt": "A detailed visual description for an image generation AI that matches this content..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Simple sanitization/parsing
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to generate structured AI content");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

/**
 * Sanitizes input to prevent prompt injection or PII leakage (Staff Enhancement)
 */
export function sanitizePrompt(input: string): string {
  let sanitized = input;

  // 1. PII Masking (Basic DLP)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  
  sanitized = sanitized.replace(emailRegex, "[EMAIL_MASKED]");
  sanitized = sanitized.replace(phoneRegex, "[PHONE_MASKED]");

  // 2. Simple Injection Detection
  const injectionPatterns = [
    "ignore previous instructions",
    "system prompt",
    "you are now",
    "forget everything"
  ];

  const hasInjection = injectionPatterns.some(pattern => 
    sanitized.toLowerCase().includes(pattern)
  );

  if (hasInjection) {
    throw new Error("Potential prompt injection detected. Request blocked.");
  }

  // 3. Control Character Cleanup
  return sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
}
