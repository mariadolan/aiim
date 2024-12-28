import useArticles from "../hooks/useArticles";

const ArticleCard = ({ article }) => {
  return <div className="bg-gray-200 px-2 py-1">{article.title}</div>;
};

const Delete = () => {
  const articles = useArticles();

  return <div className="flex flex-col space-y-2">{articles.map((article) => (<ArticleCard key={article.id} article={article} />))}</div>;
};

export default Delete;
