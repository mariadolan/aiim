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

const Search = () => {
  const articles = useArticles();
  const location = useLocation();
  //categories for advanced search hardcoded
  const [categories, setCategories] = useState([
    "ALLERGY/IMMUNOLOGY",
    "CARDIOLOGY",
    "DERMATOLOGY",
    "EMERGENCY MEDICINE",
    "ENDOCRINOLOGY",
    "GASTROENTEROLOGY",
    "HEMATOLOGY/ONCOLOGY",
    "NEUROLOGY",
    "OBSTETRICS/GYNECOLOGY",
    "OPHTHALMOLOGY",
    "ORTHOPEDICS",
    "PEDIATRICS",
    "PUBLIC HEALTH",
    "PRIMARY CARE",
    "PSYCHIATRY",
    "RADIOLOGY",
    "SURGERY",
    "TELEHEALTH",
  ]);

  
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState("bestMatch");

  useEffect(() => {
    if (!articles) return;
    const tags = articles.map((article) => article.tags).flat();
    setTags([...new Set(tags)]);
  }, [articles]);

  if (!articles) return <Loading />;

  const handleSearch = () => {
    const results = articles.filter((article) => {
      const queryMatch = searchQuery
        ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const categoryMatch = selectedCategories.length
        ? selectedCategories.includes(article.category)
        : true;

      const tagMatch = chosenTags.length
        ? chosenTags.some((tag) => article.tags.includes(tag))
        : true;

      return queryMatch && categoryMatch && tagMatch;
    });

    setSearchResults(results);
  };
//sorting article options after advanced search 
  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortOption === "mostRecent") {
      return new Date(b.date) - new Date(a.date); // sorting articles by most recent date
    }
    if (sortOption === "bestMatch") {
      // placeholder logic for "best match"
      return b.relevanceScore - a.relevanceScore; // sorting results by best match (need to implement relevance score?)
    }
    return 0;
  });

  return (
    <div className="flex flex-col space-y-5 pt-4">
      <h1 className="px-page text-2xl">Advanced Search</h1>

      {/* Search Bar */}
      <div className="px-page">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* Category Selection */}
      <h2 className="px-page text-xl">Select Categories:</h2>
      <div className="px-page grid grid-cols-4 gap-4">
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

      {/* Tag Selection */}
      <h2 className="px-page text-xl">Select Tags:</h2>
      <div className="px-page grid grid-cols-4 gap-4">
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

      {/* Search Button */}
      <div className="px-page flex justify-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Sort Options */}
      {searchResults.length > 0 && (
        <div className="px-page flex justify-end items-center space-x-4">
          <label htmlFor="sort" className="text-xl">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="bestMatch">Best Match</option>
            <option value="mostRecent">Most Recent</option>
          </select>
        </div>
      )}

      {/* Display Search Results */}
      <div className="px-page flex flex-col space-y-2">
        {sortedResults.slice(0, LIMIT).map((article) => (
          <Article key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Search;
