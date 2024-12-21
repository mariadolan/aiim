import { useRef } from "react";
import MiniSearch from "../components/MiniSearch";
import Bar from "../components/Bar";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import useArticles from "../hooks/useArticles";

const ArticleCard = ({ article }) => {

  const formartDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }


  return (
    <Link to={`/article/${article._id}`}>
      <div className="bg-gray-200 p-4 rounded-lg w-[400px] space-y-2">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-[200px] object-cover rounded-sm"
        />
        <h2 className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {article.title}
        </h2>
        <p> {formartDate(article.date)} </p>
        <p className="overflow-hidden whitespace-nowrap text-ellipsis">
          {article.summary}
        </p> 
      </div>
    </Link>
  );
};

const ArticleListHoriz = ({ articles }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400 + 16;
      scrollRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-r"
        onClick={() => scroll("left")}>
        ←
      </button>

      <div
        className="px-page flex overflow-x-auto gap-4 scroll-smooth"
        ref={scrollRef}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-l"
        onClick={() => scroll("right")}>
        →
      </button>
    </div>
  );
};

const Home = () => {
  const articles = useArticles();
  if (!articles) return <Loading />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="px-page border-b border-gray-200" />
      <h1 className="px-page text-2xl">Where AI meets Maria</h1>
      <Bar />
      <div className="p-3 px-page flex flex-row space-x-5 bg-gray-300 items-center">
        <h1 className="font-bold text-2xl flex-1">About AIIM</h1>
        <div className="flex-[3]">
          AI in Medicine (AIIM) is on a mission to integrate AI into healthcare.
          Our growing database of AI-driven medical research, categorized by
          specialty, empowers physicians, researchers, and students with easy
          access to the latest advancements. Together, we’re shaping the future
          of medicine through innovation and accessibility.
        </div>
      </div>
      <MiniSearch articles={articles} />
      <div className="flex flex-col space-y-3">
        <h1 className="px-page text-2xl">Latest Articles</h1>
        <div className="border-b border-gray-200" />
      </div>
      <ArticleListHoriz
        articles={articles
          .sort((a, b) => new Date(b.added) - new Date(a.added))
          .slice(0, 10)}
      />
    </div>
  );
};

export default Home;
