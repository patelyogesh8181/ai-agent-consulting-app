import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";

export class ConsultingAgent {
  private readonly ai: GoogleGenAI;
  private readonly instructions: string;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: env.googleApiKey,
    });

    this.instructions = fs.readFileSync(
      path.join(__dirname, "../prompts/consulting.instructions.md"),
      "utf-8",
    );
  }

  async ask(question: string): Promise<string> {
    const prompt = `
${this.instructions}

User question:
${question}
`;

    const response = await this.ai.models.generateContent({
      model: env.googleModel,
      contents: prompt,
    });

    return response.text || "No response generated.";
  }
}
