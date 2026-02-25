import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenAI, createUserContent, createPartFromUri, } from "@google/genai";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";




const app = express();
app.use(express.json());


const upload = multer({ dest: "uploads/" });

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000;

const allowedOrigins = [FRONTEND_URL]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect(process.env.MONGO_URI);

const ai = new GoogleGenAI({});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
});


const topics = new mongoose.Schema({
  title: { type: String, required: true },
  QA: [{ question: String, answer: String }]
})

const queCardShema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topics: [topics]
});


const Topic = mongoose.model("topic", topics);
const QueCard = mongoose.model("queCard", queCardShema);
const User = mongoose.model("User", userSchema);

// const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (_, __, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// -------------------- GOOGLE ROUTES --------------------
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));



app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect(`${FRONTEND_URL}/home`);
  }
);

app.get("/check-session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Unauthorized" });
}


app.post("/cardGenerator", isAuth, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user._id;
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

app.get("/fetchTopicList", isAuth, async (req, res) => {

  try {
    const userId = req.user._id;
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

app.get("/fetchTopic/:id", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
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

app.delete("/deleteTopic/:id", isAuth, async (req, res) => {
  const user = await QueCard.findOne({ userId: req.user._id });
  user.topics = user.topics.filter(t => t._id != req.params.id);
  await user.save();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
