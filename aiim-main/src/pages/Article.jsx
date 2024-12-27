import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TinyTag from "../components/TinyTag";
import Bar from "../components/Bar";

const Delete = ({ id }) => {
  const [pswd, setPswd] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axios.delete("https://aiim.xandervarga.me/article/" + id, {
        data: { pswd }
      });
      console.log(response.data);
      window.location = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="password"
        value={pswd}
        onChange={(e) => setPswd(e.target.value)}
        placeholder="Password"
        className="p-2 border border-gray-300 rounded-lg"
      />
      <button
        onClick={handleDelete}
        className="p-2 bg-red-500 text-white rounded-lg">
        Delete
      </button>
    </div>
  );
};

const Article = () => {
  const [article, setArticle] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios.get("https://aiim.xandervarga.me/article/" + id)
      .then((res) => {
        console.log(res.data);
        setArticle(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [id]);

  if (!article) {
    return (
      <div className="flex flex-col w-full justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-72 object-cover"
      />
      <div className="px-page py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
          {article.title}
        </h2>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <time className="mr-4">{article.date}</time>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {article.category}
          </span>
        </div>
        <p className="text-gray-700 mb-4">{article.implications}</p>
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline mb-4 block">
          <div className="flex space-x-2 items-center">
            <div>link to article </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4">
              <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
              <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
            </svg>
          </div>
        </a>
        <p className="text-gray-600 mb-4">{article.summary}</p>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <TinyTag key={tag} tag={tag} />
          ))}
        </div>
      </div>
      <Bar className="mt-4" />
      <div className="px-page py-4">
        <button onClick={() => setShowDelete(!showDelete)} className="">
          ...
        </button>
        {showDelete && <Delete id={id} />}
      </div>
    </div>
  );
};

export default Article;
