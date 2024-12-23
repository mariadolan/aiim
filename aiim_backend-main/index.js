import express from "express";
import mongoose from "mongoose";
import joi from "joi";
import cors from "cors";
import "dotenv/config";
import { sha512 } from "js-sha512";

const app = express();

// Configure CORS to accept requests from both your domains
app.use(cors({
  origin: ['https://www.aiimresearch.org', 'https://aiimresearch.org', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

const Schema = mongoose.Schema;
const articleSchema = new Schema({
  added: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  implications: { type: String, required: true },
  link: { type: String, required: true },
  tags: [String],
  embedding: [Number],
});

const joiArticleSchema = joi.object({
  date: joi.date().required(),
  category: joi.string().required(),
  image: joi.string().required(),
  title: joi.string().required(),
  summary: joi.string().required(),
  implications: joi.string().required(),
  link: joi.string().required(),
  tags: joi.array().items(joi.string()),
  pswd: joi.string().required(),
});

const Article = mongoose.model("Article", articleSchema);

// Add base route for health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Article routes
app.post("/article", async (req, res) => {
  try {
    if (sha512(req.body.pswd) !== process.env.PSWD_HASH)
      throw new Error("Invalid password");
    const { error } = joiArticleSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/article", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * LIMIT;
    const articles = await Article.find()
      .sort({ date: -1 })  // Sort by newest first
      .skip(skip)
      .limit(LIMIT);
    
    const total = await Article.countDocuments();
    
    res.json({
      articles,
      pagination: {
        current: page,
        total: Math.ceil(total / LIMIT),
        hasMore: skip + articles.length < total
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/article/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) throw new Error("Article not found");
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/article/:id", async (req, res) => {
  try {
    if (sha512(req.body.pswd) !== process.env.PSWD_HASH)
      throw new Error("Invalid password");
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) throw new Error("Article not found");
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const agg = (queryVector) => [
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector,
      numCandidates: 6,
      limit: 1,
    },
  },
  {
    $project: {
      added: 1,
      date: 1,
      category: 1,
      image: 1,
      title: 1,
      summary: 1,
      implications: 1,
      link: 1,
      tags: 1,
      score: {
        $meta: "vectorSearchScore",
      },
    },
  },
];

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});
