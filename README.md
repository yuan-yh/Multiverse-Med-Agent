Tech stack: 
Frontend: Next.JS

UI: shadcn, Aceternity UI

auth: clerk

Speech-to-Text -> LLM Model -> Text-to-Speect: VAPI.ai

Speech-to-Text (live streaming): Assembly.AI
(consider LiveKit for replacement)

DB: Neon Postgres
- Push change: `npx drizzle-kit push`
- Run locally: `npx drizzle-kit studio`

VAPI API: bring all AI models together

Deploy: vercel


# 🩺 Multi-Agent Medical Voice Agent

A fully-deployed, AI-powered voice assistant for healthcare consultation, which combines real-time speech recognition, intelligent medical dialogue, and secure user authentication in a clean, modern interface.
→ 🌐 **Live Demo**: [https://multiverse-med-agent-72vj.vercel.app](https://multiverse-med-agent-72vj.vercel.app)

---

## 🌟 Features

* 🎤 **Conversational Voice Agent**
  Natural voice interaction powered by **Vapi** and **AssemblyAI** (with potential support for **LiveKit**).

* 🧠 **AI-Powered Medical Insights**
  Generates accurate, empathetic responses using **OpenAI** and **Google Gemini**.

* 📡 **Real-Time Streaming**
  Supports live transcription and response processing for smooth conversations.

* 🗃️ **Serverless Persistence**
  Backed by **Neon Postgres** and **Drizzle ORM** for scalable, modern data access.

* 🖥️ **Responsive Modern UI**
  Built with **Next.js** and styled using **ShadCN**, **Aceternity UI**, and **Tailwind CSS**.

* 🔐 **Secure Authentication**
  Seamless login and user management via **Clerk**.

* 🚀 **Deployed on Vercel**
  Fast and scalable global deployment with zero-config CI/CD.

---

## 🖥️ Tech Stack

| **Tech Stack**       | **Description**                                    |
| -------------------- | -------------------------------------------------- |
| **Frontend**         | Next.js, React, Tailwind CSS                       |
| **Database**         | Neon Postgres, Drizzle ORM                         |
| **Speech (STT/TTS)** | Vapi.ai (TTS/STT pipeline), AssemblyAI (live STT)  |
| **LLM (AI Models)**  | OpenAI, Google Gemini, Gemma (if using it locally) |
| **Authentication**   | Clerk                                              |
| **Deployment**       | Vercel                                             |

---

## ⚙️ Prerequisites

* Node.js v18+
* A Neon Database account
* Vercel account for deployment
* API Keys for:

  * [Vapi.ai](https://vapi.ai/)
  * [AssemblyAI](https://www.assemblyai.com/)
  * [Clerk.dev](https://clerk.dev/)
  * [OpenAI](https://platform.openai.com/) and/or [Google Gemini](https://ai.google.dev/)

---

## 📦 Installation

```bash
git clone https://github.com/yuan-yh/Multiverse-Med-Agent.git
cd Multiverse-Med-Agent

npm install

npm run dev
```