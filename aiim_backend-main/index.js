import express from "express";
import mongoose from "mongoose";
import joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import { sha512 } from "js-sha512";

// Configure environment variables
dotenv.config();

// Initialize express app
const app = express();

// Configure CORS with specific origins
app.use(cors({
  origin: [
    'https://aiimresearch.org',
    'https://www.aiimresearch.org',
    'http://localhost:3000'  // For local development
  ],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Database connected successfully"))
.catch((err) => console.error("Database connection error:", err));

// Schema definitions
const articleSchema = new mongoose.Schema({
  added: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  implications: { type: String, required: true, trim: true },
  link: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  embedding: [Number]
}, {
  timestamps: true
});

const joiArticleSchema = joi.object({
  date: joi.date().required(),
  category: joi.string().required().trim(),
  image: joi.string().required().uri(),
  title: joi.string().required().trim(),
  summary: joi.string().required().trim(),
  implications: joi.string().required().trim(),
  link: joi.string().required().uri(),
  tags: joi.array().items(joi.string().trim()),
  pswd: joi.string().required()
});

const Article = mongoose.model("Article", articleSchema);

// Middleware for password verification
const verifyPassword = (req, res, next) => {
  if (sha512(req.body.pswd) !== process.env.PSWD_HASH) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Routes
app.post("/article", verifyPassword, async (req, res) => {
  try {
    const { error } = joiArticleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/article", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || LIMIT;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .sort({ date: -1 })  // Sort by date descending
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments();

    res.json({
      articles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("Error fetching article:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/article/:id", verifyPassword, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article deleted successfully", article });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Start server
const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
