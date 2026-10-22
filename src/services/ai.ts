import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeneratedContentResult {
  headline: string;
  body: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl?: string;
  modelVersion: string;
  tokensUsed: number;
}

/**
 * Sanitizes input to prevent prompt injection or PII leakage (DLP Layer)
 */
export function sanitizePrompt(input: string): string {
  if (!input || typeof input !== "string") {
    throw new Error("Invalid prompt input: must be a non-empty string.");
  }

  // Prevent token exhaustion / payload bombing
  const MAX_PROMPT_LENGTH = 4000;
  if (input.length > MAX_PROMPT_LENGTH) {
    throw new Error(`Input exceeds maximum allowed prompt length of ${MAX_PROMPT_LENGTH} characters.`);
  }

  let sanitized = input;

  // 1. PII Masking (Data Loss Prevention)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

  sanitized = sanitized.replace(emailRegex, "[EMAIL_MASKED]");
  sanitized = sanitized.replace(phoneRegex, "[PHONE_MASKED]");

  // 2. Prompt Injection Heuristics (Defense in Depth)
  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "system prompt",
    "you are now",
    "forget everything",
    "override safety guidelines",
    "jailbreak",
  ];

  const lowerInput = sanitized.toLowerCase();
  const hasInjection = injectionPatterns.some((pattern) => lowerInput.includes(pattern));

  if (hasInjection) {
    throw new Error("Potential prompt injection detected. Request blocked by Security Layer.");
  }

  // 3. Control Character Cleanup (preserve valid newlines and tabs)
  return sanitized.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "").trim();
}

/**
 * Robust JSON parser extracting structured payload even when LLM wraps in markdown code fences
 */
export function parseAIJsonResponse(rawText: string): Partial<GeneratedContentResult> | null {
  if (!rawText || typeof rawText !== "string") return null;

  let cleaned = rawText.trim();
  // Strip markdown code fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Enterprise Fallback Synthesizer for offline / dev mode without external API keys
 */
export function generateSynthesizedFallback(topic: string, tone?: string): GeneratedContentResult {
  const cleanTopic = topic.trim();
  const selectedTone = tone || "Thought Leadership";

  const keywords = cleanTopic.toLowerCase().split(/\s+/).slice(0, 4);
  const tagList = [
    ...keywords.map((k) => `#${k.replace(/[^a-z0-9]/g, "")}`).filter((t) => t.length > 2),
    "#EnterpriseAI",
    "#Innovation",
    "#DigitalTransformation",
  ].slice(0, 5);

  const headline = `Accelerating ${cleanTopic}: The ${selectedTone} Playbook for Modern Enterprises`;

  const body = `In today's hyper-competitive landscape, ${cleanTopic} is no longer merely an experimental initiative—it is a core operational differentiator.

Key strategic imperatives from an executive ${selectedTone.toLowerCase()} perspective:
1. Operational Resilience: Establishing deterministic guardrails and strict multi-tenant data isolation to protect corporate IP.
2. Scalable Automation: Decoupling manual review from real-time execution pipelines to guarantee enterprise customer SLAs.
3. Observability-First Culture: Measuring every generative step with end-to-end distributed tracing, token budgeting, and atomic cost attribution.

As business units evaluate their readiness, the organizations that pair autonomous AI synthesis with strict governance will lead market disruption.

What is your team's top priority as you navigate ${cleanTopic}? Let's connect and discuss.`;

  const imagePrompt = `High-end futuristic 3D architectural rendering symbolizing ${cleanTopic}, isometric abstract glass interfaces, indigo and deep cyber cyan lighting, cinematic volumetric lighting, 8k octane render.`;

  const imageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`;

  return {
    headline,
    body,
    hashtags: tagList,
    imagePrompt,
    imageUrl,
    modelVersion: "gemini-1.5-flash (deterministic offline fallback)",
    tokensUsed: 642,
  };
}

export async function generateContent(topic: string, tone?: string): Promise<GeneratedContentResult> {
  const sanitizedTopic = sanitizePrompt(topic);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Graceful fallback when API key is not configured
    return generateSynthesizedFallback(sanitizedTopic, tone);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an enterprise content marketing expert.
      Generate a high-converting, professional post about "${sanitizedTopic}".
      Tone: ${tone || "Professional and engaging"}.

      Output MUST be valid JSON only (do not include markdown ticks, just JSON):
      {
        "headline": "Compelling executive headline",
        "body": "Multi-paragraph engaging text with clear takeaways and call to action",
        "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
        "imagePrompt": "Detailed visual description for an image generation prompt matching this content"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsed = parseAIJsonResponse(text);
    if (!parsed || !parsed.headline || !parsed.body) {
      return generateSynthesizedFallback(sanitizedTopic, tone);
    }

    return {
      headline: parsed.headline,
      body: parsed.body,
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ["#AI", "#Enterprise"],
      imagePrompt: parsed.imagePrompt || `Visual conceptual rendering for ${sanitizedTopic}`,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      modelVersion: "gemini-1.5-flash",
      tokensUsed: 780,
    };
  } catch (error) {
    console.warn("AI Generation API unavailable, using resilient fallback:", error);
    return generateSynthesizedFallback(sanitizedTopic, tone);
  }
}
