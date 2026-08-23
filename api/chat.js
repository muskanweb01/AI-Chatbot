import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    const reply = chatCompletion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      error: "AI server error",
    });
  }
}
