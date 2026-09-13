const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testConnection() {
  console.log("🧪 Testing Anthropic API connection...\n");

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 100,
      system: "You are a helpful assistant.",
      messages: [
        {
          role: "user",
          content: "Say 'Connection successful!' if you can hear me.",
        },
      ],
    });

    console.log("✅ API Connection Successful!");
    console.log("\nResponse:", message.content[0].text);
    console.log("\nTokens used:");
    console.log(`  Input: ${message.usage.input_tokens}`);
    console.log(`  Output: ${message.usage.output_tokens}`);
  } catch (error) {
    console.error("❌ API Connection Failed!");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();