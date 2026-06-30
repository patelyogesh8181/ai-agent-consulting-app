import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { ConsultingAgent } from "./agents/consultingAgent";

const app = express();
const agent = new ConsultingAgent();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "IT Consulting Gen AI Agent",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const answer = await agent.ask(message);

    return res.json({
      role: "assistant",
      content: answer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Agent failed to process the request.",
    });
  }
});

app.listen(env.port, () => {
  console.log(`Agent API running on http://localhost:${env.port}`);
});
