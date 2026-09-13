# Two-Agent Help Desk Implementation Guide
## Complete Step-by-Step with VS Code

---

## Table of Contents
1. [Prerequisites & Setup](#prerequisites--setup)
2. [Step 1: Create Project in VS Code](#step-1-create-project-in-vs-code)
3. [Step 2: Get Anthropic API Key](#step-2-get-anthropic-api-key)
4. [Step 3: Initialize Node Project](#step-3-initialize-node-project)
5. [Step 4: Create Agent Prompts](#step-4-create-agent-prompts)
6. [Step 5: Build API Server](#step-5-build-api-server)
7. [Step 6: Test API Connection](#step-6-test-api-connection)
8. [Step 7: Build Frontend UI](#step-7-build-frontend-ui)
9. [Step 8: Run Locally](#step-8-run-locally)
10. [Step 9: Test Both Agents](#step-9-test-both-agents)
11. [Step 10: Deploy](#step-10-deploy)

---

## Prerequisites & Setup

Before starting, install:
- **Node.js 18+** from https://nodejs.org
- **VS Code** from https://code.visualstudio.com
- **Git** (optional but recommended)

Verify installation by opening Terminal and running:
```bash
node --version
npm --version
code --version
```

You should see version numbers like:
```
v18.17.0
9.6.4
1.84.0
```

---

## Step 1: Create Project in VS Code

### 1.1: Open VS Code

Launch VS Code. You should see this screen:

```
┌─────────────────────────────────────────────────┐
│  VS Code Welcome                                │
│                                                 │
│  [File] [Edit] [Selection] [View] [Run] [Help] │
│                                                 │
│  Welcome tab open                              │
│                                                 │
│  "Get Started"                                  │
│  "Learn"                                        │
│  "Recent"                                       │
└─────────────────────────────────────────────────┘
```

### 1.2: Create New Folder

1. Click **File** → **Open Folder**
2. Create a new folder called `law-firm-helpdesk`
3. Click **Select Folder**

You should now see:

```
┌─────────────────────────────────────────────────┐
│ law-firm-helpdesk                               │
│ ├─ (folder icon) No files yet                   │
│                                                 │
│ Explorer panel on left                          │
└─────────────────────────────────────────────────┘
```

### 1.3: Open Integrated Terminal

Press **Ctrl + `** (backtick) or go to **View → Terminal**

You should see a terminal panel open at the bottom:

```
┌─────────────────────────────────────────────────┐
│ law-firm-helpdesk                               │
│                                                 │
│ Explorer         |  Search                      │
│ ├─ EXPLORER      |                              │
│ ├─ SEARCH                                       │
│ └─ (other tabs)                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ Terminal (bottom panel)                         │
│ $ _                                             │
└─────────────────────────────────────────────────┘
```

### 1.4: Create Folder Structure

In the terminal, type:

```bash
mkdir -p server agents components integrations knowledge-base monitoring logs public
```

Press **Enter**. You should see the folder structure appear in the Explorer on the left:

```
law-firm-helpdesk
├─ agents/
├─ components/
├─ integrations/
├─ knowledge-base/
├─ logs/
├─ monitoring/
├─ public/
├─ server/
```

---

## Step 2: Get Anthropic API Key

### 2.1: Open Browser

Go to https://console.anthropic.com/keys

You should see:

```
┌─────────────────────────────────────────────┐
│ Anthropic Console                           │
│                                             │
│ Keys                                        │
│                                             │
│ [Create Key] button in top right            │
│                                             │
│ No keys yet...                              │
└─────────────────────────────────────────────┘
```

### 2.2: Create API Key

1. Click **Create Key**
2. Give it a name: `law-firm-helpdesk`
3. Click **Create**

You should see:

```
┌──────────────────────────────────────────────┐
│ Your API Key                                 │
│                                              │
│ sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx              │
│                                              │
│ [Copy] button                                │
│                                              │
│ ⚠️  Save this somewhere safe!                │
└──────────────────────────────────────────────┘
```

### 2.3: Copy the Key

Click **[Copy]** to copy the API key to your clipboard

The key looks like: `sk-ant-v5xxxxxxxxxxxxxxxxx`

---

## Step 3: Initialize Node Project

### 3.1: Create package.json

Go back to VS Code terminal and type:

```bash
npm init -y
```

Press **Enter**

You should see output:
```
$ npm init -y
npm warn using --yes to skip confirmation prompts
wrote to /Users/yourname/law-firm-helpdesk/package.json
```

Now in the Explorer, you'll see a new file:

```
law-firm-helpdesk
├─ agents/
├─ public/
├─ server/
└─ package.json  ← New file!
```

### 3.2: View package.json

Click on `package.json` in the Explorer. It opens in the editor:

```json
{
  "name": "law-firm-helpdesk",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 3.3: Edit package.json

We need to update the scripts. Click in the file and modify it:

**Replace the "scripts" section** with:

```json
  "scripts": {
    "start": "node server/api.js",
    "dev": "nodemon server/api.js",
    "test": "node test_api.js"
  },
```

It should look like:

```json
{
  "name": "law-firm-helpdesk",
  "version": "1.0.0",
  "description": "Two-agent AI help desk for law firms",
  "main": "server/api.js",
  "scripts": {
    "start": "node server/api.js",
    "dev": "nodemon server/api.js",
    "test": "node test_api.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Press **Ctrl + S** to save.

### 3.4: Install Dependencies

Go back to terminal and type:

```bash
npm install @anthropic-ai/sdk express cors dotenv
```

Press **Enter**

You should see it installing (takes 30-60 seconds):

```
$ npm install @anthropic-ai/sdk express cors dotenv

added 50 packages, and audited 51 packages in 12s

found 0 vulnerabilities
```

Now you'll see two new items in Explorer:

```
law-firm-helpdesk
├─ agents/
├─ node_modules/  ← New folder (with many sub-folders)
├─ public/
├─ server/
├─ package.json
└─ package-lock.json  ← New file
```

### 3.5: Create .env File

Right-click in the Explorer and select **New File**

Name it `.env` (it's invisible to some tools but VS Code shows it)

```
law-firm-helpdesk
├─ .env  ← New file
├─ agents/
├─ node_modules/
└─ package.json
```

Click on `.env` to open it, then add:

```env
ANTHROPIC_API_KEY=sk-ant-PASTE_YOUR_KEY_HERE
PORT=3001
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001
```

Replace `PASTE_YOUR_KEY_HERE` with the API key you copied earlier.

Press **Ctrl + S** to save.

---

## Step 4: Create Agent Prompts

### 4.1: Create Technical Support Agent

Right-click on the `agents` folder and select **New File**

Name it `technical_support.js`

```
law-firm-helpdesk
├─ agents/
│  └─ technical_support.js  ← New file
├─ .env
└─ package.json
```

Click on the file to open it, then paste this code:

```javascript
const TECHNICAL_SUPPORT_SYSTEM_PROMPT = `You are a Technical Support Agent for a growing law firm in California (currently 3 staff, scaling to 7 by year-end).

YOUR EXPERTISE:
- Apple Mac computers (macOS setup, troubleshooting, updates)
- Microsoft 365 apps: Outlook, Word, Excel, Teams, PowerPoint (desktop, web, mobile)
- OneDrive for Business: syncing, file recovery, sharing, permissions
- Slack: channels, integrations, notifications
- Device management and security on Mac
- Password resets and MFA troubleshooting

YOUR PERSONALITY:
- Professional but friendly
- Practical and solution-focused
- Patient with non-technical users
- Always emphasize data security (legal files are sensitive)

RESPONSE FORMAT:
1. Acknowledge the issue
2. Provide step-by-step instructions (numbered)
3. Include Mac keyboard shortcuts (Cmd instead of Ctrl)
4. End with "Did this work?" or "Any other issues?"

CRITICAL RULES:
- NEVER ask for passwords or sensitive information
- ALWAYS mention data backup before major changes
- Recommend restarting Mac as first troubleshooting step
- Always emphasize client file security`;

module.exports = TECHNICAL_SUPPORT_SYSTEM_PROMPT;
```

Press **Ctrl + S** to save.

**What you should see in VS Code:**

```
law-firm-helpdesk
├─ agents/
│  └─ technical_support.js  ← JavaScript code highlighted
├─ .env
└─ package.json

(In editor tab: "technical_support.js" with color syntax highlighting)
```

### 4.2: Create Legal Specialist Agent

Right-click on `agents` folder again and select **New File**

Name it `legal_specialist.js`

Paste this code:

```javascript
const LEGAL_SPECIALIST_SYSTEM_PROMPT = `You are a Legal Practice Specialist for a growing law firm in California (currently 3 staff, scaling to 7 by year-end).

YOUR EXPERTISE:
- Clio practice management software: setup, time tracking, billing, document assembly
- Case file organization and naming standards
- Client confidentiality and attorney-client privilege
- Data security and California legal requirements
- Firm policies and procedures
- Team onboarding for new paralegals
- Law firm best practices and workflows

YOUR PERSONALITY:
- Professional and compliance-conscious
- Practical about law firm workflows
- Proactive about risk management
- Patient with procedural questions

RESPONSE FORMAT:
1. Acknowledge the question
2. Provide direct answer with legal context
3. Explain the "why" behind procedures
4. Provide step-by-step instructions if applicable
5. Link to relevant policies or documentation

CRITICAL RULES:
- NEVER provide legal advice (you're IT, not counsel)
- ALWAYS emphasize attorney-client privilege protection
- ALWAYS mention compliance implications
- Escalate to attorney if legal implications are unclear`;

module.exports = LEGAL_SPECIALIST_SYSTEM_PROMPT;
```

Press **Ctrl + S** to save.

**Your agents folder should now look like:**

```
agents/
├─ technical_support.js
└─ legal_specialist.js
```

---

## Step 5: Build API Server

### 5.1: Create Main API File

Right-click on `server` folder and select **New File**

Name it `api.js`

This is the main server file. Paste this code:

```javascript
const Anthropic = require("@anthropic-ai/sdk");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

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
```

Press **Ctrl + S** to save.

**Your file structure should look like:**

```
law-firm-helpdesk/
├─ server/
│  └─ api.js  ← New file with API code
├─ agents/
│  ├─ technical_support.js
│  └─ legal_specialist.js
└─ package.json
```

---

## Step 6: Test API Connection

### 6.1: Create Test File

Right-click on the root folder (`law-firm-helpdesk`) and create a **New File**

Name it `test_api.js`

Paste this code:

```javascript
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
```

Press **Ctrl + S** to save.

### 6.2: Run Test

In the VS Code terminal, type:

```bash
npm test
```

Press **Enter**

**You should see this output:**

```
$ npm test

🧪 Testing Anthropic API connection...

✅ API Connection Successful!

Response: Connection successful!

Tokens used:
  Input: 15
  Output: 3
```

If you see this, your API key is working! ✅

**If you see an error like "Invalid API key":**
- Check your API key in `.env` file (should start with `sk-ant-`)
- Make sure you copied it correctly from the browser
- Try regenerating a new key at https://console.anthropic.com/keys

---

## Step 7: Build Frontend UI

### 7.1: Create HTML File

Right-click on the `public` folder and select **New File**

Name it `index.html`

Paste this code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Law Firm Help Desk</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f9fafb;
      padding: 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 30px;
      color: #1f2937;
    }

    .helpdesk {
      display: flex;
      gap: 20px;
      height: 600px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .sidebar {
      width: 200px;
      background: #f3f4f6;
      padding: 20px;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .agent-btn {
      padding: 12px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      text-align: left;
    }

    .agent-btn:hover {
      background: #f9fafb;
    }

    .agent-btn.active {
      border: 2px solid #3b82f6;
      background: #eff6ff;
    }

    .chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      padding: 12px;
      border-radius: 6px;
      max-width: 80%;
      word-wrap: break-word;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.user {
      background: #3b82f6;
      color: white;
      align-self: flex-end;
    }

    .message.assistant {
      background: #f3f4f6;
      color: #1f2937;
      align-self: flex-start;
    }

    .message.loading {
      color: #6b7280;
    }

    .input-area {
      display: flex;
      gap: 10px;
    }

    #input {
      flex: 1;
      padding: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    #input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    #send {
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    #send:hover:not(:disabled) {
      background: #2563eb;
    }

    #send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .agent-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
      text-transform: uppercase;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚖️ Law Firm Help Desk</h1>

    <div class="helpdesk">
      <div class="sidebar">
        <div class="agent-label">Select Agent</div>
        <button class="agent-btn active" data-agent="general">
          🛠 Technical Support
        </button>
        <button class="agent-btn" data-agent="legal">
          📋 Legal Specialist
        </button>
      </div>

      <div class="chat">
        <div class="messages" id="messages">
          <div class="message assistant">
            Hi! I'm your Technical Support Agent. I can help with Mac issues, Microsoft 365, Slack, OneDrive, and other technical questions. What can I help you with today?
          </div>
        </div>

        <div class="input-area">
          <input
            id="input"
            type="text"
            placeholder="Ask for help..."
            autocomplete="off"
          />
          <button id="send">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentAgent = "general";
    let conversationId = Math.random().toString(36).substr(2, 9);
    const messagesEl = document.getElementById("messages");
    const inputEl = document.getElementById("input");
    const sendBtn = document.getElementById("send");

    // Agent switching
    document.querySelectorAll(".agent-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".agent-btn").forEach((b) => {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        currentAgent = btn.dataset.agent;
        messagesEl.innerHTML = "";
        conversationId = Math.random().toString(36).substr(2, 9);

        const welcomeMsg = document.createElement("div");
        welcomeMsg.className = "message assistant";
        welcomeMsg.textContent =
          currentAgent === "general"
            ? "Hi! I'm your Technical Support Agent. I can help with Mac issues, Microsoft 365, Slack, OneDrive, and other technical questions."
            : "Hi! I'm your Legal Specialist. I can help with Clio, compliance, policies, and best practices for your law firm.";
        messagesEl.appendChild(welcomeMsg);
      });
    });

    // Send message function
    async function sendMessage() {
      const text = inputEl.value.trim();
      if (!text) return;

      // Add user message
      const userMsg = document.createElement("div");
      userMsg.className = "message user";
      userMsg.textContent = text;
      messagesEl.appendChild(userMsg);

      inputEl.value = "";
      sendBtn.disabled = true;

      // Scroll to bottom
      messagesEl.scrollTop = messagesEl.scrollHeight;

      try {
        // Add loading indicator
        const loadingMsg = document.createElement("div");
        loadingMsg.className = "message assistant loading";
        loadingMsg.textContent = "Thinking...";
        loadingMsg.id = "loading";
        messagesEl.appendChild(loadingMsg);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Call API
        const response = await fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: currentAgent,
            message: text,
            conversationId,
          }),
        });

        const data = await response.json();

        // Remove loading indicator
        loadingMsg.remove();

        if (data.success) {
          const botMsg = document.createElement("div");
          botMsg.className = "message assistant";
          botMsg.textContent = data.response;
          messagesEl.appendChild(botMsg);
        } else {
          const errorMsg = document.createElement("div");
          errorMsg.className = "message assistant";
          errorMsg.textContent = "Error: " + data.error;
          messagesEl.appendChild(errorMsg);
        }
      } catch (error) {
        const errorMsg = document.createElement("div");
        errorMsg.className = "message assistant";
        errorMsg.textContent = "Connection error: " + error.message;
        messagesEl.appendChild(errorMsg);
      }

      sendBtn.disabled = false;
      messagesEl.scrollTop = messagesEl.scrollHeight;
      inputEl.focus();
    }

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    inputEl.focus();
  </script>
</body>
</html>
```

Press **Ctrl + S** to save.

**Your public folder should now look like:**

```
public/
└─ index.html  ← New file with complete UI
```

---

## Step 8: Run Locally

### 8.1: Start the Server

In the VS Code terminal, type:

```bash
npm start
```

Press **Enter**

You should see:

```
$ npm start

> law-firm-helpdesk@1.0.0 start
> node server/api.js

✅ Help Desk API running on http://localhost:3001
📊 View stats at http://localhost:3001/api/stats
💚 Health check at http://localhost:3001/health
```

This means your server is running! ✅

### 8.2: Open in Browser

Open a web browser and go to:

```
http://localhost:3001
```

You should see this:

```
┌─────────────────────────────────────────────┐
│ ⚖️ Law Firm Help Desk                       │
│                                             │
│  ┌──────────────┬──────────────────────┐   │
│  │ Select Agent │                      │   │
│  │              │ Hi! I'm your         │   │
│  │ 🛠 Technical │ Technical Support    │   │
│  │   Support    │ Agent...             │   │
│  │              │                      │   │
│  │ 📋 Legal     │                      │   │
│  │   Specialist │ [Ask for help...]    │   │
│  │              │                      │   │
│  └──────────────┴──────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Step 9: Test Both Agents

### 9.1: Test Technical Support Agent

The Technical Support agent should already be selected (highlighted in blue).

Type in the input field:

```
How do I sync my Mac to OneDrive?
```

Press **Enter** or click **Send**

**You should see the response appear:**

```
┌──────────────────────────────────────┐
│ How do I sync my Mac to OneDrive?    │ (Your message on right)
│                                      │
│ To sync your Mac to OneDrive, here   │ (Agent response on left)
│ are the step-by-step instructions:   │
│                                      │
│ 1. Install OneDrive from the App     │
│    Store if you haven't already      │
│                                      │
│ 2. Open OneDrive and sign in with    │
│    your Microsoft account...         │
│                                      │
└──────────────────────────────────────┘
```

Try another question:

```
Teams keeps crashing on my Mac
```

### 9.2: Test Legal Specialist Agent

Click on the **📋 Legal Specialist** button (it turns blue)

Notice the conversation clears and shows a new welcome message.

Type:

```
How do I set up Clio for the first time?
```

Press **Enter**

You should get a response about Clio setup steps instead of Mac troubleshooting.

Try another question:

```
What's our document retention policy?
```

The Legal Specialist agent should talk about compliance and policies.

---

## Step 10: Deploy

### 10.1: Deploy to Vercel (Easiest)

First, push your code to GitHub (optional but recommended):

```bash
git init
git add .
git commit -m "Initial commit: two-agent help desk"
```

Then install Vercel CLI in terminal:

```bash
npm install -g vercel
```

Now deploy:

```bash
vercel
```

Follow the prompts:

```
? Set up and deploy "~/law-firm-helpdesk"? [Y/n] y
? Which scope do you want to deploy to? (Your account name)
? Link to existing project? [y/N] n
? What's your project's name? law-firm-helpdesk
? In which directory is your code located? ./
? Want to modify these settings? [y/N] n
```

Then add your API key:

```
? Add ANTHROPIC_API_KEY to .env.production? [y/N] y
? What's the value of ANTHROPIC_API_KEY? sk-ant-xxxxx
```

Press **Enter**

You should see:

```
✅ Production: https://law-firm-helpdesk.vercel.app
```

Visit that URL in your browser to see your live help desk!

### 10.2: Or Deploy to Self-Hosted Server

**Using DigitalOcean (recommended for $6/month server):**

1. Create a Droplet at https://digitalocean.com
2. SSH into it: `ssh root@your-server-ip`
3. Run these commands:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repo
git clone https://github.com/yourname/law-firm-helpdesk.git
cd law-firm-helpdesk

# Install dependencies
npm install

# Create .env with API key
nano .env
# Paste: ANTHROPIC_API_KEY=sk-ant-xxxxx
# Press Ctrl+X, then Y, then Enter

# Install PM2 to keep it running
npm install -g pm2
pm2 start server/api.js --name "helpdesk"
pm2 startup
pm2 save
```

Your server is now running at: `http://your-server-ip:3001`

---

## Customizing for Your Law Firm

Now that it's working, customize it:

### Add Your Firm's Procedures

Open `agents/technical_support.js` in VS Code and add specific Mac setup instructions for your firm.

Example:

```javascript
YOUR EXPERTISE:
- Apple Mac computers (macOS setup, troubleshooting, updates)
  * Firm uses MacBook Air M2 or M3
  * All staff use Ventura or Sonoma OS
  * Standard apps: Chrome, Slack, Teams, VS Code
  * All devices encrypted with FileVault
```

Similarly, edit `agents/legal_specialist.js` and add your Clio-specific setup.

### Add Knowledge Base

Create a file in `knowledge-base/` called `FAQ.md`:

```markdown
# Frequently Asked Questions

## OneDrive Sync

Q: My OneDrive isn't syncing
A: 
1. Check if OneDrive is running
2. Go to OneDrive Settings
3. Click "Sync now"
4. If still not working, restart your Mac

## Clio Time Tracking

Q: How do I track billable hours?
A:
1. Open the matter in Clio
2. Click "Time Entries"
3. Enter hours and description
4. Click Save
```

---

## Monitoring Your Help Desk

In VS Code terminal, check your API usage:

```bash
curl http://localhost:3001/api/stats
```

You should see:

```json
{
  "totalApiCalls": 5,
  "totalTokensUsed": 2450,
  "estimatedCost": 0.05
}
```

---

## Troubleshooting in VS Code

### Issue: "Cannot find module '@anthropic-ai/sdk'"

**Solution in terminal:**

```bash
npm install @anthropic-ai/sdk
```

### Issue: "Error: ENOENT: no such file or directory, open '.env'"

**Solution:**
1. In VS Code Explorer, right-click root folder
2. Select "New File"
3. Name it `.env`
4. Add your API key

### Issue: "Port 3001 is already in use"

**Solution in terminal:**

```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process (replace 12345 with the PID from above)
kill -9 12345

# Try npm start again
npm start
```

### Issue: API returns error messages

**Solution:**
1. Click on `server/api.js` in VS Code
2. Look at the terminal output for error details
3. Check your `.env` file has the correct API key
4. Run `npm test` to verify API connection works

---

## Next Steps

1. ✅ You now have a working two-agent help desk
2. Customize agent prompts for your firm
3. Build out knowledge base with FAQ
4. Deploy to Vercel or self-hosted
5. Share with team
6. Monitor usage and iterate

---

## Quick Reference: VS Code Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save file | Ctrl + S |
| Open file | Ctrl + P |
| Search in file | Ctrl + F |
| Replace in file | Ctrl + H |
| Open terminal | Ctrl + ` |
| Copy line | Ctrl + C |
| Delete line | Ctrl + Shift + K |
| Comment line | Ctrl + / |
| Format document | Shift + Alt + F |
| Go to line | Ctrl + G |

---

## Your Final File Structure

When complete, your VS Code Explorer should look like:

```
law-firm-helpdesk
├─ .env                          (Your API key here)
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ test_api.js                   (For testing)
├─ README.md
│
├─ agents/
│  ├─ technical_support.js       (Technical agent)
│  └─ legal_specialist.js        (Legal agent)
│
├─ server/
│  └─ api.js                     (Main API server)
│
├─ public/
│  └─ index.html                 (Web UI)
│
├─ knowledge-base/
│  ├─ FAQ.md
│  ├─ onboarding.md
│  └─ troubleshooting.md
│
├─ logs/
│  └─ (usage tracking)
│
└─ node_modules/                 (All dependencies)
```

---

## Success! 🎉

You now have a fully functional two-agent AI help desk system running locally in VS Code!

**What you built:**
✅ Two specialized AI agents (Technical Support + Legal Specialist)
✅ Professional web interface with agent switching
✅ RESTful API backend using Express.js
✅ Integration with Anthropic Claude API
✅ Conversation history management
✅ Deployable to Vercel or self-hosted servers

**Next:** Customize it for your law firm and deploy!
