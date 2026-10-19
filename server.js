import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "10kb" }));

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable missing");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

app.get("/", (req, res) => {
  res.send("Mian Mithu Voice Server is running");
});

app.post("/api/voice", async (req, res) => {
  try {
    const text = req.body?.text;

    if (typeof text !== "string" ||
        text.trim().length === 0 ||
        text.length > 1000) {
      return res.status(400).json({
        error: "Text zaroori hai (maximum 1000 characters)"
      });
    }

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "onyx",
      input: text.trim(),
      instructions:
        "Speak as a natural, mature male AI assistant. " +
        "Use a warm, confident, clear voice, slightly deep in tone. " +
        "Speak Roman Urdu naturally and pronounce words clearly. " +
        "Avoid an exaggerated robotic effect.",
      response_format: "mp3"
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "no-store");
    res.send(buffer);

  } catch (error) {
    console.error("Voice generation failed:", error.message);

    res.status(500).json({
      error: "Voice generate nahi ho saki"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mian Mithu Voice Server running on port ${PORT}`);
});
          
