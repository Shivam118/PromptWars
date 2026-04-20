import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface ZoneData {
  id: string;
  name: string;
  crowdDensity: number;
  estimatedWaitTime: number;
}

export async function POST(request: NextRequest) {
  try {
    // Basic Security: Validate payload
    const body = await request.json();
    if (!body || !body.zones || !Array.isArray(body.zones)) {
      return NextResponse.json({ error: "Invalid payload shape" }, { status: 400 });
    }

    const zones: ZoneData[] = body.zones;
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

    if (!process.env.GEMINI_API_KEY) {
      // Mock fallback if API key is not present (demonstrates structure without breaking)
      const congested = zones.find((z) => z.crowdDensity > 80);
      const mockInsight = congested
        ? `Mock AI Insight: ${congested.name} is critically congested at ${congested.crowdDensity}%. Consider dispatching extra personnel and redirecting traffic via digital signage.`
        : "Mock AI Insight: Venue metrics are stable. No immediate rerouting required.";
      
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({ insight: mockInsight });
    }

    // Google Services Integration - Gemini LLM
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    return NextResponse.json({ insight: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights." },
      { status: 500 }
    );
  }
}
