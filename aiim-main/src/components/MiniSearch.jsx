import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TinyTag from "./TinyTag";
import Bar from "../components/Bar";

const LIMIT = 5;

const Selectable = ({ selected, className, children, onClick }) => {
  const style = `p-4 ${
    selected
      ? "text-white bg-gray-700 hover:bg-gray-800"
      : "bg-gray-200 hover:bg-gray-300 "
  } ${className}`;

  return (
    <div onClick={onClick} className={style}>
      {children}
    </div>
  );
};

const Category = ({ category, selected, handleClick }) => {
  return (
    <Selectable
      selected={selected}
      className={"rounded-lg"}
      onClick={handleClick}>
      <h2>{category}</h2>
    </Selectable>
  );
};

const Article = ({ article }) => {
  return (
    <Link to={`/article/${article._id}`}>
      <div className="flex items-center ">
        <img
          src={article.image}
          alt={article.title}
          className="h-24 w-24 object-cover rounded-sm"
        />
        <div className="flex flex-col p-2">
          <h2 className="font-bold">{article.title}</h2>
          <p>{article.summary}</p>
          <div className="flex space-x-2">
            {article.tags.map((tag) => (
              <TinyTag key={tag} tag={tag} />
            ))}
          </div>
        </div>
        <Bar />
      </div>
    </Link>
  );
};

const Search = ({ articles }) => {
  const [categories, setCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  // const [semanticSearch, setSemanticSearch] = useState("");

  useEffect(() => {
    const categories = articles.map((article) => article.category);
    const tags = articles.map((article) => article.tags).flat();
    setCategories([...new Set(categories)]);
  }, []);

  const filtered = articles.filter(
    (article) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(article.category)
  );

  return (
    <div className="flex flex-col space-y-5">
      <div className="px-page grid grid-cols-6 gap-4">
        {categories.map((category) => (
          <Category
            key={category}
            category={category}
            selected={selectedCategories.includes(category)}
            handleClick={() =>
              setSelectedCategories(
                selectedCategories.includes(category)
                  ? selectedCategories.filter((c) => c !== category)
                  : [...selectedCategories, category]
              )
            }
          />
        ))}
      </div>
      {selectedCategories.length > 0 && (
        <div className="px-page flex flex-col space-y-2 p-4">
          {filtered.slice(0, LIMIT).map((article) => (
            <Article key={article.id} article={article} />
          ))}
        </div>
      )}
      {filtered.length > LIMIT && (
        <div className="px-page w-full">
          <Link to="/search">
            <div className="flex items-center space-x-2 p-4 bg-gray-200 rounded-lg">
              <div>View More...</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4">
                <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Search;
