import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Article = () => {
  const [article, setArticle] = useState(null);
  const [pswd, setPswd] = useState('');
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/article/${id}`)
      .then((res) => {
        console.log(res.data);
        setArticle(res.data);
      })
      .catch((err) => {
        console.error('Error fetching article:', err);
      });
  }, [id]);

  const handleDelete = () => {
    axios.delete(`/article/${id}`, {
      data: { pswd }
    })
      .then((res) => {
        console.log(res.data);
        window.location = '/';
      })
      .catch((err) => {
        console.error('Error deleting article:', err);
      });
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="mb-4">
        <p className="text-gray-600">{article.date}</p>
        <p className="text-gray-600">Category: {article.category}</p>
      </div>
      <div className="mb-4">
        <img src={article.image} alt={article.title} className="max-w-full h-auto" />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <p>{article.summary}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Implications</h2>
        <p>{article.implications}</p>
      </div>
      <div className="mb-4">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
          Read Original Article
        </a>
      </div>
      <div className="mt-8">
        <input
          type="password"
          value={pswd}
          onChange={(e) => setPswd(e.target.value)}
          placeholder="Enter password to delete"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Article
        </button>
      </div>
    </div>
  );
};

export default Article;