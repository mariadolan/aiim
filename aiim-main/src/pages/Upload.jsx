import { useState } from "react";
import axios from "axios";
import joi from "joi";

const TinyTagX = ({ tag, remove }) => {
  return (
    <div className="flex space-x-3 bg-gray-200 p-2 py-1 rounded-lg">
      <h2>{tag}</h2>
      <button onClick={remove}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4">
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

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

const Upload = () => {
  const [article, setArticle] = useState({
    date: "",
    category: "",
    image: "",
    title: "",
    summary: "",
    implications: "",
    link: "",
    tags: [],
    pswd: "",
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = joiArticleSchema.validate(article);
    if (error) {
      setErrors(error.details[0].message);
      return;
    }

    axios.post("https://aiim.xandervarga.me/article", article).then((res) => {
      console.log(res.data);
      setSuccess("Article added successfully");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setArticle({
        ...article,
        date: "",
        category: "",
        image: "",
        title: "",
        summary: "",
        implications: "",
        link: "",
        tags: [],
      });
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <h1 className="text-2xl font-bold">Add a New Article (secret page)</h1>
      <form
        className="flex flex-col gap-4 w-1/2"
        onSubmit={handleSubmit}
        noValidate>
        <input
          type="date"
          name="date"
          value={article.date}
          onChange={handleChange}
          placeholder="Date"
        />
        <input
          type="text"
          name="category"
          value={article.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <input
          type="text"
          name="image"
          value={article.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <input
          type="text"
          name="title"
          value={article.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="summary"
          value={article.summary}
          onChange={handleChange}
          placeholder="Summary"
        />
        <input
          type="text"
          name="implications"
          value={article.implications}
          onChange={handleChange}
          placeholder="Implications"
        />
        <input
          type="text"
          name="link"
          value={article.link}
          onChange={handleChange}
          placeholder="Link"
        />
        <div className="flex space-x-3 ">
          {article.tags.map((tag) => (
            <TinyTagX
              key={tag}
              tag={tag}
              remove={() =>
                setArticle({
                  ...article,
                  tags: article.tags.filter((t) => t !== tag),
                })
              }
            />
          ))}
        </div>
        <div className="flex space-x-3 ">
          <input
            type="text"
            value={newTag}
            className="bg-gray-200 p-2 rounded-lg"
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
          />
          <button
            type="button"
            className="bg-gray-200 p-2 rounded-lg"
            onClick={() => {
              if (!newTag) return;
              if (article.tags.includes(newTag)) return;
              setNewTag("");
              setArticle({ ...article, tags: [...article.tags, newTag] });
            }}>
            Add Tag +
          </button>
        </div>
        {errors && (
          <div className="flex flex-col p-4 rounded-lg space-y-2 text-red-500">
            {errors.toString()}
          </div>
        )}
        {success && (
          <div className="flex flex-col p-4 rounded-lg space-y-2 text-green-500">
            {success}
          </div>
        )}
      </form>
      <div className="flex space-x-3">
        <input
          type="password"
          placeholder="Password"
          className="bg-gray-200 p-2 rounded-lg"
          value={article.pswd}
          onChange={(e) => setArticle({ ...article, pswd: e.target.value })}
        />
        <button onClick={handleSubmit} className="bg-gray-200 p-2 rounded-lg">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Upload;
