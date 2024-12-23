import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";

const useArticleStore = create(() => ({
  articles: null,
}));

const useArticles = () => {
  const articles = useArticleStore((state) => state.articles);

  useEffect(() => {
    if (!articles) {
      axios
        .get("https://aiim.xandervarga.me/article")
        .then((res) => useArticleStore.setState({ articles: res.data }));
    }
  }, []);

  return articles;
};

export default useArticles;
