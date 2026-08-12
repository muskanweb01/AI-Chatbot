
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
console.log(req.body);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant",
    });
console.log(chatCompletion);
    const reply = chatCompletion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      reply: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});