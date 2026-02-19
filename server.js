import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenAI, createUserContent, createPartFromUri, } from "@google/genai";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";




const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];
const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);



mongoose.connect(process.env.MONGO_URI);

const ai = new GoogleGenAI({});

const topics = new mongoose.Schema({
  title: { type: String, required: true },
  QA: [{ question: String, answer: String }]
})

const queCardShema = new mongoose.Schema({
  userId: { type: Number, required: true },
  topics: [topics]
});


const Topic = mongoose.model("topic", topics);
const QueCard = mongoose.model("queCard", queCardShema);


app.post("/cardGenerator", upload.single("file"), async (req, res) => {
  try {
    const userId = 123;
    const user = await QueCard.findOne({ userId });


    if (!user) {
      const newUser = new QueCard({ userId, topics: [] });
      await newUser.save();
      user = newUser;
    }

    const title = req.body.title;
    const inputType = req.body.inputType;
    const uploadedFile = req.file;

    console.log("Title:", title);
    console.log("Input Type:", inputType);
    console.log("AI api hit");

    const myfile = await ai.files.upload({
      file: uploadedFile.path,
      config: { mimeType: uploadedFile.mimetype },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        `Return ONLY valid JSON. No markdown. Generate exactly 30 flashcards from this PDF. Return JSON array like:[{ "question": "....", "answer": "...." }]`,
      ]),
    });


    let generatedText;
    try {
      generatedText = response.response.text();
    } catch (e) {
      generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;
    }

    console.log("Generated Text:", generatedText);

    const cleaned = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();

    const cards = JSON.parse(cleaned);

    const newQueCard = new Topic({
      title,
      QA: cards
    });

    user.topics.push(newQueCard);
    const savedQueCard = await user.save();

    return res.status(201).json(savedQueCard);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/fetchTopicList", async (req, res) => {

  try {
    const userId = 123;
    const result = await QueCard.findOne({ userId });

    if (!result) {
      return res.status(200).json([]);
    }

    const topics = result.topics;

    return res.status(200).json(topics);
  }
  catch (err) {
    return res.status(500).json({ error: err.message });
  }

});

app.get("/fetchTopic/:id", async (req, res) => {
  try {
    const userId = 123;
    const result = await QueCard.findOne({ userId });

    if (!result) {
      return res.status(404).json({ error: "User Not Found" });
    }


    const topicId = req.params.id;
    const topic = result.topics.find((t) => String(t._id) === String(topicId));


    if (!topic) {
      return res.status(404).json({ error: "User Not Found" });
    }

    return res.status(200).json(topic);

  }
  catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on Port: 3000");
});
