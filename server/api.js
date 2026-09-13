const Anthropic = require("@anthropic-ai/sdk");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TECHNICAL_SUPPORT_PROMPT = require("../agents/technical_support");
const LEGAL_SPECIALIST_PROMPT = require("../agents/legal_specialist");

const agentPrompts = {
  general: TECHNICAL_SUPPORT_PROMPT,
  legal: LEGAL_SPECIALIST_PROMPT,
};

// Store conversation history (in-memory for now)
const conversations = new Map();

// Main message endpoint
app.post("/api/message", async (req, res) => {
  try {
    const { agent, message, conversationId } = req.body;

    // Validate agent type
    if (!agentPrompts[agent]) {
      return res.status(400).json({ error: "Invalid agent type" });
    }

    // Get or create conversation history
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }

    const history = conversations.get(conversationId);

    // Add user message to history
    history.push({
      role: "user",
      content: message,
    });

    // Call Claude API
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: agentPrompts[agent],
      messages: history,
    });

    const assistantMessage = response.content[0].text;

    // Store assistant response
    history.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Return response
    res.json({
      success: true,
      response: assistantMessage,
      conversationId,
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history
app.get("/api/history/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  const history = conversations.get(conversationId) || [];
  res.json({ history });
});

// Clear conversation
app.delete("/api/history/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  conversations.delete(conversationId);
  res.json({ success: true });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Help Desk API running on http://localhost:${PORT}`);
  console.log(`📊 View stats at http://localhost:${PORT}/api/stats`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
});