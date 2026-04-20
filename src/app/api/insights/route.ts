import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// ---------------------------------------------------------------------------
// TYPES & INTERFACES
// ---------------------------------------------------------------------------
interface ZoneData {
  id: string;
  name: string;
  crowdDensity: number;
  estimatedWaitTime: number;
}

/**
 * HTTP POST Handler for AI Event Management Insights
 *
 * This endpoint accepts live real-time metrics (Zones) from the stadium
 * dashboard, validates the payload, and dynamically queries the built-in
 * Google Gemini model to return a single actionable logistical insight.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Basic Security & Data Validation
    // Ensuring the incoming payload has the correct logical structure before processing.
    const body = await request.json();
    if (!body || !body.zones || !Array.isArray(body.zones)) {
      return NextResponse.json({ error: "Invalid payload shape" }, { status: 400 });
    }

    const zones: ZoneData[] = body.zones;

    // 2. Prompt Engineering
    // Collapse all metrics into a concise string format for the LLM to ingest cleanly.
    const promptContext = zones
      .map(
        (z) =>
          `Zone: ${z.name}. Density: ${z.crowdDensity}%. Wait Time: ${z.estimatedWaitTime}m.`
      )
      .join("\n");

    const systemPrompt = `You are an expert AI event coordinator for a large stadium.
Given the current metrics below, provide exactly one short, actionable insight or diversion tactic to alleviate bottlenecks.
Keep it under two sentences.

Metrics:
${promptContext}`;

    // 3. Fallback / Mock Mode Handling (For local Hackathon testing)
    // If the GEMINI_API_KEY is not defined, we bypass the AI integration and
    // use a mock conditional structure to demonstrate the data parsing flow.
    if (!process.env.GEMINI_API_KEY) {
      const congested = zones.find((z) => z.crowdDensity > 80);
      const mockInsight = congested
        ? `Mock AI Insight: ${congested.name} is critically congested at ${congested.crowdDensity}%. Consider dispatching extra personnel and redirecting traffic via digital signage.`
        : "Mock AI Insight: Venue metrics are stable. No immediate rerouting required.";
      
      // Simulate external network latency for a realistic UI representation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({ insight: mockInsight });
    }

    // 4. Production AI Integration: Google GenAI (Flash Model)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: systemPrompt,
    });

    return NextResponse.json({ insight: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights. Check system logs." },
      { status: 500 }
    );
  }
}
