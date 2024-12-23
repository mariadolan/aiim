import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";

const API_BASE_URL = 'https://api.aiimresearch.org';

const useArticleStore = create(() => ({
  articles: null,
}));

const useArticles = () => {
  const articles = useArticleStore((state) => state.articles);

  useEffect(() => {
    if (!articles) {
      axios
        .get(`${API_BASE_URL}/article`)
        .then((res) => useArticleStore.setState({ articles: res.data }));
    }
  }, []);

  return articles;
};

export default useArticles;
