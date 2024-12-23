import express from "express";
import mongoose from "mongoose";
import joi from "joi";
import cors from "cors";
import "dotenv/config";
import { sha512 } from "js-sha512";

// Define constants at the top
const PORT = process.env.PORT || 3014;
const LIMIT = 10;

const app = express();

// Configure CORS to accept requests from both your domains
app.use(cors({
  origin: ['https://www.aiimresearch.org', 'https://aiimresearch.org', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection with better error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const Schema = mongoose.Schema;
const articleSchema = new Schema({
  added: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true, trim: true },  // Added trim
  image: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  implications: { type: String, required: true, trim: true },
  link: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  embedding: [Number],
}, { timestamps: true });  // Added timestamps

const joiArticleSchema = joi.object({
  date: joi.date().required(),
  category: joi.string().required().trim(),
  image: joi.string().required().trim(),
  title: joi.string().required().trim(),
  summary: joi.string().required().trim(),
  implications: joi.string().required().trim(),
  link: joi.string().required().trim(),
  tags: joi.array().items(joi.string()),
  pswd: joi.string().required()
});

const Article = mongoose.model("Article", articleSchema);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is running",
    timestamp: new Date()
  });
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
    
    const [articles, total] = await Promise.all([
      Article.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(LIMIT),
      Article.countDocuments()
    ]);
    
    res.json({
      articles,
      pagination: {
        current: page,
        total: Math.ceil(total / LIMIT),
        hasMore: skip + articles.length < total,
        count: articles.length,
        totalArticles: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/article/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/article/:id", async (req, res) => {
  try {
    if (sha512(req.body.pswd) !== process.env.PSWD_HASH) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    
    res.json({ 
      message: "Article deleted successfully",
      article 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
});

// Error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  mongoose.connection.close(false, () => {
    process.exit(1);
  });
});
