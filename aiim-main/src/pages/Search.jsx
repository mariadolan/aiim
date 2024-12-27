import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import TinyTag from "../components/TinyTag";
import Bar from "../components/Bar";
import Loading from "../components/Loading";
import useArticles from "../hooks/useArticles";

const LIMIT = 10;

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

const Tag = ({ tag, selected, handleClick }) => {
  return (
    <Selectable
      selected={selected}
      className={"rounded-lg"}
      onClick={handleClick}>
      <h2>{tag}</h2>
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

const AndOrBtn = ({ val, set }) => {
  return (
    <div className="flex">
      <Selectable
        selected={val}
        className="rounded-l-lg"
        onClick={() => set(true)}>
        AND
      </Selectable>
      <Selectable
        selected={!val}
        className="rounded-r-lg"
        onClick={() => set(false)}>
        OR
      </Selectable>
    </div>
  );
};

const Search = () => {
  const articles = useArticles();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [advanced, setAdvanced] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [exactSearch, setExactSearch] = useState("");
  const [chosenTags, setChosenTags] = useState([]);
  const [and1, setAnd1] = useState(false);
  const [_and2, setAnd2] = useState(true);

  useEffect(() => {
    if (!articles) return;
    const categories = articles.map((article) => article.category);
    const tags = articles.map((article) => article.tags).flat();
    setTags([...new Set(tags)]);
    setCategories([...new Set(categories)]);
  }, [articles]);

  useEffect(() => {
    const search = new URLSearchParams(location.search).get("q");
    setExactSearch(search);
  }, [location.search]);

  if (!articles) return <Loading />;

  const and2 = _and2 && exactSearch;

  const hasInput = Boolean(
    selectedCategories.length || exactSearch || chosenTags.length
  );

  return (
    <div className="flex flex-col space-y-5 pt-4">
      <h1 className="px-page text-2xl">Search for an Article</h1>
      <input type="checkbox" onChange={() => setAdvanced(!advanced)} />

      {advanced && (
        <>
          <Bar />
          <h2 className="px-page text-xl">In one of these categories:</h2>
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
          <div className="px-page flex items-center space-x-2">
            <AndOrBtn val={and1} set={setAnd1} />
            <h2 className="text-xl">With one of these tags:</h2>
          </div>
          <div className="px-page grid grid-cols-6 gap-4">
            {tags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                selected={chosenTags.includes(tag)}
                handleClick={() =>
                  setChosenTags(
                    chosenTags.includes(tag)
                      ? chosenTags.filter((t) => t !== tag)
                      : [...chosenTags, tag]
                  )
                }
              />
            ))}
          </div>
          <div className="flex px-page items-center space-x-2">
            <AndOrBtn val={and2} set={setAnd2} />
            <h2 className="text-xl">Which contain:</h2>
          </div>
          <Bar />
        </>
      )}
      <div className="px-page w-full">
        <input
          type="text"
          className="bg-gray-200 p-4 rounded-lg"
          placeholder="search"
          value={exactSearch}
          onChange={(e) => setExactSearch(e.target.value)}
        />
      </div>

      {hasInput && (
        <div className="px-page flex flex-col space-y-2 p-4">
          {articles
            .filter((article) => {
              const categoryMatch = selectedCategories.includes(
                article.category
              );
              const tagMatch = chosenTags.some((tag) =>
                article.tags.includes(tag)
              );
              const exactMatch =
                exactSearch &&
                (article.title.includes(exactSearch) ||
                  article.summary.includes(exactSearch) ||
                  article.implications.includes(exactSearch));

              const block1 = and1
                ? categoryMatch && tagMatch
                : categoryMatch || tagMatch;

              const block2 = and2 ? block1 && exactMatch : block1 || exactMatch;

              return block2;
            })
            .slice(0, LIMIT)
            .map((article) => (
              <Article key={article.id} article={article} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
