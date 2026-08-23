import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const reply = chatCompletion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      reply: error.message,
    });
  }
});

export default app;
