import express from "express";
import mongoose from "mongoose";
import joi from "joi";
import cors from "cors";
import "dotenv/config"; //theres a .env file with the MONGO_URI that im hiding bc it would like let everyone hack me
import { sha512 } from "js-sha512";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

const PORT = 3014;
app.listen(PORT, () => console.log(`Server on ${PORT}`));


//mongoos schema for the DB
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

//joi schema for double checking it before I add it to the DB
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

//post a new article (pswd protected)
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

//gets all the articles
const LIMIT = 10;
app.get("/article", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const skip = (page - 1) * LIMIT;
    const articles = await Article.find().skip(skip).limit(LIMIT);
    res.json(articles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//gets an article by ID (not used bc the current frontent just pulls all of them at once)
app.get("/article/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) throw new Error("Article not found");
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//checks pswd, if its good, deletes article by its id
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

//this is not used yet. Its for semantic search if we ever need that later
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
