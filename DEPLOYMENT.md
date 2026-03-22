# ContextOS: Enterprise Setup Guide

Welcome to ContextOS. This guide is written for IT Administrators, Operations Leaders, and Founders. It explains how to deploy ContextOS inside your organisation without writing code.

ContextOS is a **privacy-first, on-device AI memory engine**. It connects to your company's data (Gmail, Slack, Drive, Jira) and turns it into a searchable, chat-able hive mind — **without ever sending your data to the cloud**.

---

## 1. Why On-Device? (The Privacy Guarantee)

Most AI tools (like ChatGPT or Claude) send your private company data to external servers. This is a massive security risk, violating strict data policies and the **DPDP Act 2023**.

ContextOS runs 100% locally on your machine.
- **Zero Cloud Bills**: No API costs per query.
- **Total Privacy**: Your data never leaves your internal network.
- **Compliance Ready**: Instantly compliant with SOC 2, HIPAA, and GDPR data residency requirements.

---

## 2. Hardware Requirements (Powered by AMD)

ContextOS is heavy software. It runs a Vector Database (ChromaDB) and a Large Language Model (Mistral 7B/Phi-3) simultaneously.

**Required:**
- **Processor**: AMD Ryzen™ AI PC (Ryzen 7040/8040 series or newer)
- **RAM**: Minimum 16GB (32GB strongly recommended for Enterprise teams)
- **Storage**: 50GB free SSD space for the Vector Database

*Why AMD?* ContextOS utilizes the AMD Ryzen AI NPU (Neural Processing Unit) to accelerate local AI tasks. This means lower battery usage, silent operation, and answers generated 4x faster than standard CPUs.

---

## 3. Installation in 3 Steps

ContextOS is packaged as a standard self-hosted application.

### Step 1: Install Dependencies
You need Python 3.11+ and Node.js. 
You also need **Ollama**, which is the engine that runs the local AI models.
Download Ollama from [ollama.com](https://ollama.com) and install it.

### Step 2: Download the Models
Open your terminal (Command Prompt or Terminal app) and run:
`ollama pull phi3:mini` (for the fast text model)
`ollama pull nomic-embed-text` (for understanding documents)

### Step 3: Start ContextOS
Inside the ContextOS folder, there are two servers to start.
1. **The Brain (Backend)**: Open a terminal in the `/backend` folder and run `uvicorn main:app --reload`
2. **The Interface (Frontend)**: Open a second terminal in the `/frontend` folder and run `npm run def`

Open your browser to `http://localhost:5173`. You are now running ContextOS!

---

## 4. Connecting Your Data Sources

Once ContextOS is running, go to the **Integration Dashboard**.

1. **Gmail**: Click "Connect". ContextOS will fetch your team's emails and index them locally.
2. **Local Files**: Drag and drop PDFs, docs, and meeting notes into the Upload page.
3. **Slack / Jira** (Growth Plan): Enter your API keys in the settings page. ContextOS will automatically stay in sync every 30 minutes.

---

## 5. Pricing & Enterprise Support

ContextOS is free for individuals and small teams (up to 15 users).

If you are a larger organisation needing active directory integration (SSO), custom data connectors (like SAP), or dedicated AMD hardware bundles, check out our **Growth** and **Enterprise** plans on our website.

- **Growth**: ₹14,999/month (up to 100 users, unlimited memory)
- **Enterprise**: Custom pricing (includes AMD hardware bundle + dedicated support engineer)

---

## 6. Troubleshooting

**"ContextOS is thinking... but nothing happens!"**
This usually means Ollama went to sleep. Open your terminal and type `ollama serve` to wake it up.

**"No memories found."**
ContextOS needs data to be smart! Go to the Upload page and paste in some recent meeting notes or company policies.

**Need Help?**
Email our support team at support@contextos.ai with your error code (e.g., `OLLAMA_OFFLINE`).
